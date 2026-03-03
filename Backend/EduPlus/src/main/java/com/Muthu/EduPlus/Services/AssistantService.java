package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.ChatResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class AssistantService {

    private final AiModelService aiModelService;
    private final AboutUserService aboutUserService;

    public AssistantService(AiModelService aiModelService, AboutUserService aboutUserService) {
        this.aiModelService = aiModelService;
        this.aboutUserService = aboutUserService;
    }

    private static final String CHATBOT_PROMPT = """
            You are an AI assistant designed to provide helpful and intelligent responses.

            Personality traits:
            - Friendly and professional
            - Clear, patient, and understanding
            - Highly knowledgeable on general topics and capable of logical reasoning
            - Always provide helpful, actionable, and accurate information
            - If you are unsure about a specific detail, politely say so and offer alternatives
            - Keep responses concise but still meaningful
            - Use emojis occasionally to sound friendly (but do not overuse them)

            Always maintain conversation context.
            """;

    private static final String PERSONALITY_EXTRACTION_PROMPT = """
            You are a personality analysis engine. Your ONLY job is to extract concrete personal facts from the user's message.

            Extract facts such as:
            - Interests and hobbies (e.g. "Interest: Music", "Hobby: Photography")
            - Goals and dreams (e.g. "Goal: Become a software engineer")
            - Skills and strengths (e.g. "Skill: Python programming")
            - Learning subjects (e.g. "Studying: Mathematics, Physics")
            - Personal preferences (e.g. "Prefers: Visual learning")
            - Career aspirations (e.g. "Aspires to: Data Science")
            - Personality traits (e.g. "Trait: Introvert", "Trait: Creative")
            - Any other personal information shared

            Rules:
            1. Output ONLY extracted facts, one per line, in the format "Category: Value"
            2. If no personal facts are present, output exactly: NONE
            3. Do NOT include opinions, greetings, or commentary
            4. Do NOT duplicate facts already obvious from context
            5. Maximum 5 facts per message
            6. Keep each fact under 60 characters

            User message:
            """;

    public ChatResponse getAiResponse(String message) {

        if (message == null || message.trim().isEmpty()) {
            return new ChatResponse(
                    "Please enter a valid message 🙂",
                    "false");
        }

        return aiModelService.getAiResponseWithHistory(
                message.trim(),
                new ArrayList<>(),
                CHATBOT_PROMPT);
    }

    /**
     * Called by the chat endpoint — receives the real frontend conversation history
     * so Gemini has full session context.
     */
    public ChatResponse getAiResponseWithHistory(String message, List<String> history) {

        if (message == null || message.trim().isEmpty()) {
            return new ChatResponse(
                    "Please enter a valid message 🙂",
                    "false");
        }

        return aiModelService.getAiResponseWithHistory(
                message.trim(),
                history,
                CHATBOT_PROMPT);
    }

    /**
     * Analyzes the user's message with Gemini to extract personal facts,
     * then stores any new facts in the AboutUser document (fire-and-forget).
     */
    public void analyzeAndStorePersonality(String message) {
        try {
            // Get existing facts to avoid duplicates
            List<String> existing = aboutUserService.getUserdata();
            String existingStr = String.join(", ", existing);

            String analysisPrompt = PERSONALITY_EXTRACTION_PROMPT
                    + message
                    + "\n\nAlready known facts (do NOT repeat these): " + existingStr;

            ChatResponse result = aiModelService.getAiResponse(
                    analysisPrompt,
                    "Extract facts only. No conversation.",
                    false);

            String rawFacts = result.getResponse();
            if (rawFacts == null || rawFacts.isBlank() || rawFacts.trim().equals("NONE"))
                return;

            // Parse and store each fact
            Arrays.stream(rawFacts.split("\n"))
                    .map(String::trim)
                    .filter(line -> !line.isBlank() && !line.equalsIgnoreCase("NONE"))
                    .filter(line -> line.contains(":")) // must be "Category: Value" format
                    .filter(line -> line.length() <= 80) // sanity length check
                    .filter(line -> !existing.contains(line)) // skip duplicates
                    .limit(5)
                    .forEach(aboutUserService::addData);

        } catch (Exception e) {
            // Fire-and-forget: silently ignore errors so chat is never blocked
            System.err.println("[PersonalityAnalysis] Error: " + e.getMessage());
        }
    }
}
