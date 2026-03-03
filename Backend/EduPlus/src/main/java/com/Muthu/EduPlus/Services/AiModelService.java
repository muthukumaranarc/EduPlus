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

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1/models/"
            + "gemini-2.5-flash:generateContent?key=";

    private static final int MAX_PROMPT_LENGTH = 30000;
    private static final int MAX_HISTORY_SIZE = 20; // keep last 20 turns (10 exchanges)

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public AiModelService(AboutUserService aboutUserService) {
        this.aboutUserService = aboutUserService;
        this.restTemplate = new RestTemplate();
    }

    /**
     * Called with full conversation history from the frontend.
     * history = alternating [userMsg0, aiReply0, userMsg1, aiReply1, ...,
     * currentUserMsg]
     * The last element is the current user message (already appended by frontend).
     */
    public ChatResponse getAiResponseWithHistory(
            String message,
            List<String> history,
            String chatbotPrompt) {
        // Build formatted history — exclude the last element (current message)
        List<String> priorTurns = new ArrayList<>();
        if (history != null && history.size() > 1) {
            List<String> prev = history.subList(0, history.size() - 1);
            for (int i = 0; i < prev.size(); i++) {
                String prefix = (i % 2 == 0) ? "User: " : "Assistant: ";
                priorTurns.add(prefix + prev.get(i));
            }
            // trim to last MAX_HISTORY_SIZE entries
            if (priorTurns.size() > MAX_HISTORY_SIZE) {
                priorTurns = priorTurns.subList(priorTurns.size() - MAX_HISTORY_SIZE, priorTurns.size());
            }
        }

        String finalPrompt = buildPrompt(chatbotPrompt, message, priorTurns);

        GeminiRequest requestBody = createGeminiRequest(finalPrompt);
        HttpEntity<GeminiRequest> entity = createHttpEntity(requestBody);

        try {
            ResponseEntity<GeminiResponse> response = restTemplate.postForEntity(
                    GEMINI_URL + geminiApiKey,
                    entity,
                    GeminiResponse.class);

            String aiReply = extractAiResponse(response.getBody());
            if (aiReply == null) {
                return new ChatResponse("⚠️ Gemini returned an empty response.", "false");
            }

            return new ChatResponse(aiReply, "true");

        } catch (Exception e) {
            return new ChatResponse("Gemini error: " + e.getMessage(), "false");
        }
    }

    /**
     * Stateless call (no history) — used for personality extraction, revision,
     * analysis, etc.
     */
    public ChatResponse getAiResponse(
            String message,
            String chatbotPrompt,
            boolean useHistory) {
        String finalPrompt = buildPrompt(chatbotPrompt, message, new ArrayList<>());

        GeminiRequest requestBody = createGeminiRequest(finalPrompt);
        HttpEntity<GeminiRequest> entity = createHttpEntity(requestBody);

        try {
            ResponseEntity<GeminiResponse> response = restTemplate.postForEntity(
                    GEMINI_URL + geminiApiKey,
                    entity,
                    GeminiResponse.class);

            String aiReply = extractAiResponse(response.getBody());
            if (aiReply == null) {
                return new ChatResponse("⚠️ Gemini returned an empty response.", "false");
            }

            return new ChatResponse(aiReply, "true");

        } catch (Exception e) {
            return new ChatResponse("Gemini error: " + e.getMessage(), "false");
        }
    }

    private String buildPrompt(
            String basePrompt,
            String message,
            List<String> formattedHistory) {
        StringBuilder prompt = new StringBuilder();

        prompt.append(basePrompt)
                .append("\nAbout user: ")
                .append(aboutUserService.getUserDataInString());

        if (!formattedHistory.isEmpty()) {
            prompt.append("\n\nConversation History (most recent first shown last):\n");
            formattedHistory.forEach(h -> prompt.append(h).append("\n"));
        }

        prompt.append("\nCurrent User Message: ")
                .append(message)
                .append("\nRespond naturally and contextually, remembering the entire conversation above.");

        String result = prompt.toString();
        return result.length() > MAX_PROMPT_LENGTH
                ? result.substring(0, MAX_PROMPT_LENGTH)
                : result;
    }

    private GeminiRequest createGeminiRequest(String prompt) {
        GeminiRequest.Part part = new GeminiRequest.Part(prompt);
        GeminiRequest.Content content = new GeminiRequest.Content(List.of(part));
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
}