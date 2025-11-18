package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.ChatRequest;
import com.Muthu.EduPlus.Models.ChatResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class AssistantService {

    @Autowired
    private AboutUserService aboutUserService;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String API_URL = "https://apifreellm.com/api/chat";

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

    private final List<String> userHistory = new ArrayList<>();

    public ChatResponse getAiResponse(String message) {

        // Store user message in history
        userHistory.add("User: " + message);

        // Final composed prompt
        String enMessage =
                CHATBOT_PROMPT +
                        "About user: " + aboutUserService.getUserDataInString() + "\n" +
                        "Conversation History: " + userHistory + "\n" +
                        "Current User Message: " + message + "\n" +
                        "Please respond naturally considering the conversation context above.";

        // Build request model
        ChatRequest request = new ChatRequest(enMessage);

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<ChatRequest> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<ChatResponse> response =
                    restTemplate.postForEntity(API_URL, entity, ChatResponse.class);

            assert response.getBody() != null;

            // Add assistant response to history
            userHistory.add("Assistant: " + response.getBody().getResponse());

            return response.getBody();
        }
        catch (Exception e) {
            e.printStackTrace();
            return new ChatResponse("Error: " + e.getMessage(), "false");
        }
    }
}
