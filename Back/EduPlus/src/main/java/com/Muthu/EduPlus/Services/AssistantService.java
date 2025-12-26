package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.ChatResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AssistantService {

    @Autowired
    private AiModelService aiModelService;

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

    public ChatResponse getAiResponse(String message) {
        return aiModelService.getAiResponse(message, CHATBOT_PROMPT, true);
    }
}
