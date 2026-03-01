package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.AiAnalysisResponse;
import com.Muthu.EduPlus.Models.Test;
import com.Muthu.EduPlus.Models.TestGroup;
import com.Muthu.EduPlus.Models.UserTest;
import com.Muthu.EduPlus.Repositories.TestRepo;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AiAnalysisService {

    private final TestRepo testRepo;
    private final AiModelService aiModelService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiAnalysisService(TestRepo testRepo, AiModelService aiModelService) {
        this.testRepo = testRepo;
        this.aiModelService = aiModelService;
    }

    public AiAnalysisResponse analyzeWeakness(String username) {

        // ── Step 1: Fetch user's test data ───────────────────────────────────
        UserTest userTest = testRepo.findById(username).orElse(null);

        if (userTest == null || userTest.getTestGroup() == null || userTest.getTestGroup().isEmpty()) {
            return new AiAnalysisResponse(
                    List.of("No test data found yet"),
                    List.of(),
                    List.of("Take some tests first so EduPlus AI can analyze your performance!")
            );
        }

        // ── Step 2: Build performance summary ────────────────────────────────
        // The app stores tests by group name and test title (no score fields).
        // We pass the full inventory of subjects (groups) and topics (tests) to
        // Gemini so it can reason about coverage, gaps, and recommendations.
        StringBuilder summary = new StringBuilder();

        for (TestGroup group : userTest.getTestGroup()) {
            String subject = group.getName();
            if (group.getGroup() == null || group.getGroup().isEmpty()) {
                summary.append("Subject: ").append(subject)
                       .append(" — no tests yet\n");
                continue;
            }

            summary.append("Subject: ").append(subject).append("\n");
            for (Test test : group.getGroup()) {
                int questionCount = (test.getQuestionSet() != null)
                        ? test.getQuestionSet().size() : 0;
                summary.append("  Topic/Test: ").append(test.getTitle())
                       .append(" (").append(questionCount).append(" questions)\n");
            }
            summary.append("\n");
        }

        // ── Step 3: Build Gemini prompt ───────────────────────────────────────
        String prompt = """
                You are EduPlus AI — an intelligent academic tutor analyzing a student's test inventory.

                Below is the student's full list of subjects and topics/tests they have created on the platform.
                Subjects with many topics indicate strong coverage; subjects with very few or no topics may indicate gaps.
                Treat topics with very few questions as potentially weak areas.

                DATA:
                %s

                Based on this data, identify:
                1. Weak topics — subjects/topics that seem under-prepared (few questions, missing areas, or no tests yet)
                2. Strong topics — subjects/topics that look well-covered
                3. Personalized recommendations to help the student improve

                Respond ONLY with a valid JSON object exactly in this format (no markdown, no extra text):
                {
                  "weakTopics": ["topic1", "topic2"],
                  "strongTopics": ["topic1", "topic2"],
                  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
                }
                """.formatted(summary.toString());

        // ── Step 4: Call Gemini ───────────────────────────────────────────────
        String aiRaw = aiModelService.getAiResponse(prompt, "", false).getResponse();

        // ── Step 5: Parse JSON response ───────────────────────────────────────
        return parseGeminiResponse(aiRaw);
    }

    // ── JSON parser ───────────────────────────────────────────────────────────
    private AiAnalysisResponse parseGeminiResponse(String raw) {
        try {
            // Strip markdown fences if present
            String cleaned = raw
                    .replaceAll("(?s)```json", "")
                    .replaceAll("(?s)```", "")
                    .trim();

            // Find outermost JSON object
            int start = cleaned.indexOf("{");
            int end   = cleaned.lastIndexOf("}");
            if (start == -1 || end == -1) {
                throw new RuntimeException("No JSON object in response");
            }
            cleaned = cleaned.substring(start, end + 1);

            JsonNode root = objectMapper.readTree(cleaned);

            List<String> weak = parseStringList(root.get("weakTopics"));
            List<String> strong = parseStringList(root.get("strongTopics"));
            List<String> recs = parseStringList(root.get("recommendations"));

            return new AiAnalysisResponse(weak, strong, recs);

        } catch (Exception e) {
            // Graceful fallback
            return new AiAnalysisResponse(
                    List.of("Could not parse AI response"),
                    List.of(),
                    List.of("Please try again. If this persists, contact support.")
            );
        }
    }

    private List<String> parseStringList(JsonNode node) throws Exception {
        if (node == null || !node.isArray()) return new ArrayList<>();
        return objectMapper.readValue(
                node.toString(),
                new TypeReference<List<String>>() {}
        );
    }
}
