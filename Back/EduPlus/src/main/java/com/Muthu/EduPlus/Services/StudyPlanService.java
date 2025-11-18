package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.ChatRequest;
import com.Muthu.EduPlus.Models.ChatResponse;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;

@Service
public class StudyPlanService {

    @Autowired
    private AboutUserService aboutUserService;

    private final Tika tika = new Tika();
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String API_URL = "https://apifreellm.com/api/chat";

    // Prompt Template
    private static final String CHATBOT_PROMPT = """
        You are an AI assistant. Follow these rules while generating the response:

        1. Explain the content from the UPLOADED TEXT strictly based on the USER QUERY.
        2. Create personalized explanations or notes tailored to the user's personality and preferences using USER DETAILS.
        3. Always craft the output specially for the user by incorporating information from ABOUT USER.
        4. Add relevant emojis to make the response more engaging and interactive.

        """;

    private ChatResponse getAiResponse(String message) {

        String finalPrompt = CHATBOT_PROMPT +
                "\n--- CONVERSATION INPUT START ---\n" +
                    message +
                "\n--- CONVERSATION INPUT END ---\n" +
                "Now produce the best possible helpful response.\n";

        ChatRequest request = new ChatRequest(finalPrompt);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<ChatRequest> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<ChatResponse> response =
                    restTemplate.postForEntity(API_URL, entity, ChatResponse.class);

            assert response.getBody() != null;
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return new ChatResponse("Error: " + e.getMessage(), "false");
        }
    }

    public String extractText(MultipartFile file) throws IOException, TikaException, SAXException {
        try (InputStream inputStream = file.getInputStream()) {
            BodyContentHandler handler = new BodyContentHandler(-1);
            Metadata metadata = new Metadata();
            AutoDetectParser parser = new AutoDetectParser();
            parser.parse(inputStream, handler, metadata);
            return handler.toString();
        }
    }

    public String process(String file, String query) {

        query = query.isEmpty()
                ? "Explain this all in short"
                : query;

        String message = """
                ABOUT USER:
                %s

                UPLOADED TEXT:
                %s

                USER QUERY:
                %s
                """
                .formatted(aboutUserService.getUserDataInString(), file, query);

        ChatResponse response = getAiResponse(message);
        return response.getStatus().equals("success") ? response.getResponse() : "Failed";
    }

    public String process(MultipartFile file, String query)
            throws TikaException, IOException, SAXException {

        query = query.isEmpty() ? "Explain this all in short" : query;

        String message = """
                ABOUT USER:
                %s

                UPLOADED TEXT:
                %s

                USER QUERY:
                %s
                """
                .formatted(aboutUserService.getUserDataInString(), extractText(file), query);

        ChatResponse response = getAiResponse(message);
        return response.getStatus().equals("success") ? response.getResponse() : "Failed";
    }
}
