package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.ChatResponse;
import com.Muthu.EduPlus.Models.GeminiRequest;
import com.Muthu.EduPlus.Models.GeminiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class AiModelService {

    @Autowired
    private AboutUserService aboutUserService;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1/models/"
                    + "gemini-2.5-flash:generateContent?key=";

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final List<String> userHistory = new ArrayList<>();

    public ChatResponse getAiResponse(String message, String CHATBOT_PROMPT, boolean useHistory) {

        if(useHistory) userHistory.add("User: " + message);

        String finalPrompt =
                CHATBOT_PROMPT +
                        "\nAbout user: " + aboutUserService.getUserDataInString() +
                        (useHistory ? "\nConversation History: " + userHistory : null) +
                        "\nCurrent User Message: " + message +
                        "\nRespond naturally considering the context.";

        if (finalPrompt.length() > 30000) {
            finalPrompt = finalPrompt.substring(0, 30000);
        }

        GeminiRequest.Part part = new GeminiRequest.Part(finalPrompt);
        GeminiRequest.Content content =
                new GeminiRequest.Content(List.of(part));

        GeminiRequest requestBody =
                new GeminiRequest(List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<GeminiRequest> entity =
                new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<GeminiResponse> response =
                    restTemplate.postForEntity(
                            GEMINI_URL + geminiApiKey,
                            entity,
                            GeminiResponse.class
                    );


            if (response.getBody() == null ||
                    response.getBody().getCandidates() == null ||
                    response.getBody().getCandidates().isEmpty() ||
                    response.getBody().getCandidates().get(0).getContent() == null ||
                    response.getBody().getCandidates().get(0).getContent().getParts() == null ||
                    response.getBody().getCandidates().get(0).getContent().getParts().isEmpty()) {

                return new ChatResponse(
                        "⚠️ Gemini returned an empty response.",
                        "false"
                );
            }

            String aiReply =
                    response.getBody()
                            .getCandidates()
                            .get(0)
                            .getContent()
                            .getParts()
                            .get(0)
                            .getText();

            if(useHistory) userHistory.add("Assistant: " + aiReply);

            return new ChatResponse(aiReply, "true");

        } catch (Exception e) {
            e.printStackTrace();

            return new ChatResponse(
                    "Gemini error: " + e.getMessage(),
                    "false"
            );
        }
    }
}
