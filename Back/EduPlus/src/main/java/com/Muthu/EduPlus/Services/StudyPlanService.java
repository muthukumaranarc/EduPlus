package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.ChatRequest;
import com.Muthu.EduPlus.Models.ChatResponse;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.parser.ocr.TesseractOCRConfig;
import org.apache.tika.sax.BodyContentHandler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;


@Service
public class StudyPlanService {

    @Autowired
    private AiModelService aiModelService;

    private static final String CHATBOT_PROMPT = """
        You are an AI assistant. Follow these rules while generating the response:

        1. Explain the content from the UPLOADED TEXT strictly based on the USER QUERY.
        2. Create personalized explanations or notes tailored to the user's personality and preferences using USER DETAILS.
        3. Always craft the output specially for the user by incorporating information from ABOUT USER.
        4. Add relevant emojis to make the response more engaging and interactive.

        """;


    public String extractText(MultipartFile file)
            throws IOException, TikaException, SAXException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > 50_000_000) {
            throw new IllegalArgumentException("File size exceeds limit");
        }

        int maxRetries = 3;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {

            try (InputStream inputStream = file.getInputStream()) {

                BodyContentHandler handler = new BodyContentHandler(-1);
                Metadata metadata = new Metadata();

                AutoDetectParser parser = new AutoDetectParser();
                ParseContext context = new ParseContext();

                TesseractOCRConfig ocrConfig = new TesseractOCRConfig();
                ocrConfig.setLanguage("eng");
                ocrConfig.setPageSegMode("6");
                ocrConfig.setPreserveInterwordSpacing(true);

                context.set(TesseractOCRConfig.class, ocrConfig);
                context.set(Parser.class, parser);

                parser.parse(inputStream, handler, metadata, context);

                String result = handler.toString().trim();

                if (!result.isEmpty()) {
                    return result;
                }

            } catch (Exception e) {
                System.err.println("Text extraction failed (attempt "
                        + attempt + "): " + e.getMessage());
            }

            try {
                Thread.sleep(500L * attempt);
            } catch (InterruptedException ignored) {
            }
        }

        return "Unable to extract text from this file. Please try another file.";
    }

    public String process(String file, String query) {

        query = query.isEmpty()
                ? "Explain this all in short"
                : query;

        String message = """
                UPLOADED TEXT:
                %s

                USER QUERY:
                %s
                """
                .formatted(file, query);

        ChatResponse response = aiModelService.getAiResponse(message, CHATBOT_PROMPT, false);
        return response.getStatus().equals("true") ? response.getResponse() : "Failed";
    }

    public String process(MultipartFile file, String query)
            throws TikaException, IOException, SAXException {

        query = query.isEmpty() ? "Explain this all in short" : query;

        String message = """
                UPLOADED TEXT:
                %s

                USER QUERY:
                %s
                """
                .formatted(extractText(file), query);

        ChatResponse response = aiModelService.getAiResponse(message, CHATBOT_PROMPT, false);
        return response.getStatus().equals("true") ? response.getResponse() : "Failed";

    }
}
