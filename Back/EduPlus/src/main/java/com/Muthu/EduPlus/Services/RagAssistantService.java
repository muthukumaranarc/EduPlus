package com.Muthu.EduPlus.Services;

import org.springframework.stereotype.Service;

@Service
public class RagAssistantService {

    private final SyllabusService syllabusService;
    private final AiModelService aiModelService;

    public RagAssistantService(SyllabusService syllabusService, AiModelService aiModelService) {
        this.syllabusService = syllabusService;
        this.aiModelService = aiModelService;
    }

    public String askWithSyllabus(String username, String question) {

        if (question == null || question.isBlank()) {
            return "Please enter a valid question 🙂";
        }

        String relevantContent = syllabusService.findRelevantContent(username, question);

        String prompt;

        if (!relevantContent.isBlank()) {
            prompt = """
                    You are EduPlus AI tutor.

                    Answer using ONLY the following syllabus content provided below.
                    Do NOT use outside knowledge.

                    SYLLABUS CONTENT:
                    %s

                    STUDENT QUESTION:
                    %s

                    Instructions:
                    - Answer clearly and concisely based on the syllabus above.
                    - If the answer is not found in the syllabus content, say: "This topic is not covered in your uploaded syllabus."
                    - Use bullet points or short paragraphs when helpful.
                    - Keep the tone friendly and educational.
                    """
                    .formatted(relevantContent, question);
        } else {
            prompt = """
                    You are EduPlus AI tutor.

                    No syllabus content was found matching this question.
                    Answer the following question clearly and helpfully from general knowledge:

                    QUESTION:
                    %s
                    """.formatted(question);
        }

        return aiModelService.getAiResponse(prompt, "", false).getResponse();
    }
}
