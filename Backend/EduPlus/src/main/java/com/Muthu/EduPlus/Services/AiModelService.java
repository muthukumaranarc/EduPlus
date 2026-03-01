package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.ChatResponse;
import com.Muthu.EduPlus.Models.GeminiRequest;
import com.Muthu.EduPlus.Models.GeminiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class AiModelService {

    private final AboutUserService aboutUserService;
    private final RestTemplate restTemplate;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1/models/"
                    + "gemini-2.5-flash:generateContent?key=";

    private static final int MAX_PROMPT_LENGTH = 30000;
    private static final int MAX_HISTORY_SIZE = 10;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public AiModelService(AboutUserService aboutUserService) {
        this.aboutUserService = aboutUserService;
        this.restTemplate = new RestTemplate();
    }

    public ChatResponse getAiResponse(
            String message,
            String chatbotPrompt,
            boolean useHistory
    ) {

        List<String> conversationHistory = new ArrayList<>();

        if (useHistory) {
            conversationHistory.add("User: " + message);
            trimHistory(conversationHistory);
        }

        String finalPrompt = buildPrompt(
                chatbotPrompt,
                message,
                conversationHistory,
                useHistory
        );

        GeminiRequest requestBody = createGeminiRequest(finalPrompt);
        HttpEntity<GeminiRequest> entity = createHttpEntity(requestBody);

        try {
            ResponseEntity<GeminiResponse> response =
                    restTemplate.postForEntity(
                            GEMINI_URL + geminiApiKey,
                            entity,
                            GeminiResponse.class
                    );

            String aiReply = extractAiResponse(response.getBody());
            if (aiReply == null) {
                return new ChatResponse(
                        "⚠️ Gemini returned an empty response.",
                        "false"
                );
            }

            if (useHistory) {
                conversationHistory.add("Assistant: " + aiReply);
                trimHistory(conversationHistory);
            }

            return new ChatResponse(aiReply, "true");

        } catch (Exception e) {
            return new ChatResponse(
                    "Gemini error: " + e.getMessage(),
                    "false"
            );
        }
    }

    private String buildPrompt(
            String basePrompt,
            String message,
            List<String> history,
            boolean useHistory
    ) {
        StringBuilder prompt = new StringBuilder();

        prompt.append(basePrompt)
                .append("\nAbout user: ")
                .append(aboutUserService.getUserDataInString());

        if (useHistory && !history.isEmpty()) {
            prompt.append("\nConversation History:\n");
            history.forEach(h -> prompt.append(h).append("\n"));
        }

        prompt.append("\nCurrent User Message: ")
                .append(message)
                .append("\nRespond naturally considering the context.");

        String result = prompt.toString();
        return result.length() > MAX_PROMPT_LENGTH
                ? result.substring(0, MAX_PROMPT_LENGTH)
                : result;
    }

    private GeminiRequest createGeminiRequest(String prompt) {
        GeminiRequest.Part part = new GeminiRequest.Part(prompt);
        GeminiRequest.Content content =
                new GeminiRequest.Content(List.of(part));
        return new GeminiRequest(List.of(content));
    }

    private HttpEntity<GeminiRequest> createHttpEntity(GeminiRequest body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(body, headers);
    }

    private String extractAiResponse(GeminiResponse response) {
        if (response == null ||
                response.getCandidates() == null ||
                response.getCandidates().isEmpty()) {
            return null;
        }

        var candidate = response.getCandidates().get(0);
        if (candidate.getContent() == null ||
                candidate.getContent().getParts() == null ||
                candidate.getContent().getParts().isEmpty()) {
            return null;
        }

        return candidate.getContent().getParts().get(0).getText();
    }

    private void trimHistory(List<String> history) {
        if (history.size() > MAX_HISTORY_SIZE) {
            history.subList(0, history.size() - MAX_HISTORY_SIZE).clear();
        }
    }
}