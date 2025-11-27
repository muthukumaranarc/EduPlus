package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.ChatRequest;
import com.Muthu.EduPlus.Models.ChatResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CommunicationHelpService {


    @Autowired
    private AboutUserService aboutUserService;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String API_URL = "https://apifreellm.com/api/chat";

    private static final String CHATBOT_PROMPT = """
    You are an AI assistant specialized in teaching and generating English grammar topics.
    Personality traits:
    - Friendly and professional
    - Clear, patient, and highly understandable
    - Expert in English grammar concepts, rules, examples, and explanations
    - Able to break down complex grammar topics into simple, easy-to-learn points
    - Always provide accurate information, examples, and short practice questions when useful
    - If asked for unrelated information, gently guide the user back to English learning
    - Keep responses concise but educational
    - Use emojis occasionally to stay friendly (but not overuse them)
    Always maintain conversation context.
    """;

    public ChatResponse getAiResponse(String message) {

        // Final composed prompt
        String enMessage =
                CHATBOT_PROMPT +
                        "About user: " + aboutUserService.getUserDataInString() + "\n" +
                        "Grammar topic: " + message + "\n" +
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

            return response.getBody();
        }
        catch (Exception e) {
            e.printStackTrace();
            return new ChatResponse("Error: " + e.getMessage(), "false");
        }
    }

}
