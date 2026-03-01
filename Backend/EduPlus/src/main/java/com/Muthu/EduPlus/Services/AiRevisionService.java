package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.AiRevisionResponse;
import com.Muthu.EduPlus.Models.Syllabus;
import com.Muthu.EduPlus.Repositories.SyllabusRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AiRevisionService {

    private final SyllabusRepository syllabusRepository;
    private final AiModelService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiRevisionService(SyllabusRepository syllabusRepository, AiModelService aiModelService) {
        this.syllabusRepository = syllabusRepository;
        this.geminiService = aiModelService;
    }

    public AiRevisionResponse generateRevision(String username, String subject) {

        // Step 1: Fetch all syllabus entries for this user and subject
        List<Syllabus> syllabusList = syllabusRepository.findByUsernameAndSubject(username, subject);

        if (syllabusList == null || syllabusList.isEmpty()) {
            return new AiRevisionResponse(
                    "No syllabus data found for this subject. Please add some topics first.",
                    List.of(),
                    List.of(),
                    List.of());
        }

        // Step 2: Combine content
        StringBuilder contentBuilder = new StringBuilder();
        for (Syllabus s : syllabusList) {
            contentBuilder.append(s.getUnit())
                    .append(" - ")
                    .append(s.getTopic())
                    .append("\n")
                    .append(s.getContent() != null ? s.getContent() : "")
                    .append("\n\n");
        }

        String syllabusContent = contentBuilder.toString();

        // Limit to prevent enormous prompts (roughly 5000 chars or reasonable chunk)
        if (syllabusContent.length() > 5000) {
            syllabusContent = syllabusContent.substring(0, 5000) + "...";
        }

        // Step 3: Build Gemini prompt
        String prompt = """
                You are an expert exam tutor.

                Create exam revision notes from this syllabus.

                Include:
                1. Summary
                2. Key Points
                3. Important Exam Questions
                4. Quick Revision Tips

                SYLLABUS:
                %s

                Respond ONLY with a valid JSON object exactly in this format (no markdown, no extra text):
                {
                  "summary": "...",
                  "keyPoints": ["point1", "point2"],
                  "importantQuestions": ["question1", "question2"],
                  "revisionTips": ["tip1", "tip2"]
                }
                """.formatted(syllabusContent);

        // Step 4: Call AiModelService (acts as GeminiService) and get response
        try {
            String aiRaw = geminiService.getAiResponse(prompt, "", false).getResponse();

            // Step 5: Parse response and return AiRevisionResponse object
            // Strip markdown fences if present
            String cleaned = aiRaw
                    .replaceAll("(?s)```json", "")
                    .replaceAll("(?s)```", "")
                    .trim();

            // Find outermost JSON object
            int start = cleaned.indexOf("{");
            int end = cleaned.lastIndexOf("}");
            if (start == -1 || end == -1) {
                throw new RuntimeException("No JSON object in response");
            }
            cleaned = cleaned.substring(start, end + 1);

            JsonNode root = objectMapper.readTree(cleaned);

            String summary = root.has("summary") ? root.get("summary").asText() : "";
            List<String> keyPoints = parseStringList(root.get("keyPoints"));
            List<String> importantQuestions = parseStringList(root.get("importantQuestions"));
            List<String> revisionTips = parseStringList(root.get("revisionTips"));

            return new AiRevisionResponse(summary, keyPoints, importantQuestions, revisionTips);
        } catch (Exception e) {
            return new AiRevisionResponse(
                    "Failed to generate AI revision notes: " + e.getMessage(),
                    List.of(),
                    List.of(),
                    List.of("Try again later or check your API key"));
        }
    }

    private List<String> parseStringList(JsonNode node) throws Exception {
        if (node == null || !node.isArray())
            return new ArrayList<>();
        return objectMapper.readValue(
                node.toString(),
                new TypeReference<List<String>>() {
                });
    }
}
