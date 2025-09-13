package com.Muthu.EduPlus.Services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class StudyPlanService {

    @Value("${deepseak.api.key}")
    private String API_KEY;

    @Value("${deepseak.api.url}")
    private String BASE_URL;

    private final ObjectMapper mapper = new ObjectMapper();

    public String getResults(String input) throws IOException, InterruptedException {
        // Build request body
        ObjectNode root = mapper.createObjectNode();
        root.put("model", "deepseek/deepseek-r1");
        root.put("max_tokens", 1000);

        ArrayNode messages = root.putArray("messages");
        ObjectNode message = messages.addObject();
        message.put("role", "user");
        message.put("content", input);

        String body = mapper.writeValueAsString(root);

        // Send HTTP POST request
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + API_KEY)
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        // Parse JSON and extract the assistant's content
        JsonNode jsonResponse = mapper.readTree(response.body());
        JsonNode choices = jsonResponse.get("choices");
        if (choices != null && choices.isArray() && choices.size() > 0) {
            JsonNode messageNode = choices.get(0).get("message");
            if (messageNode != null && messageNode.has("content")) {
                return messageNode.get("content").asText(); // Return only the content
            }
        }

        return "No content found in response.";
    }
}
