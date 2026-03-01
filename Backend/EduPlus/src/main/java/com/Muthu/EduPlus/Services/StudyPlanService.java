package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.ChatResponse;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.parser.ocr.TesseractOCRConfig;
import org.apache.tika.sax.BodyContentHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;

@Service
public class StudyPlanService {

    private static final Logger log = LoggerFactory.getLogger(StudyPlanService.class);

    @Autowired
    private AiModelService aiModelService;

    private static final String DEFAULT_QUERY = "Explain this all in short";

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
            throw new IllegalArgumentException("Uploaded file is empty");
        }

        if (file.getSize() > 50_000_000) {
            throw new IllegalArgumentException("File size exceeds 50MB limit");
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
                ocrConfig.setPreserveInterwordSpacing(true);

                context.set(TesseractOCRConfig.class, ocrConfig);
                context.set(Parser.class, parser);

                parser.parse(inputStream, handler, metadata, context);

                String result = handler.toString().trim();
                if (!result.isEmpty()) {
                    return result;
                }

            } catch (Exception e) {
                log.warn("Text extraction failed (attempt {}): {}", attempt, e.getMessage());
                sleep(attempt);
            }
        }

        throw new RuntimeException("Unable to extract text from the uploaded file");
    }

    public ChatResponse processText(String text, String query) {

        query = normalizeQuery(query);

        String message = """
                UPLOADED TEXT:
                %s

                USER QUERY:
                %s
                """.formatted(text, query);

        return aiModelService.getAiResponse(message, CHATBOT_PROMPT, false);
    }

    public ChatResponse processFile(MultipartFile file, String query)
            throws IOException, TikaException, SAXException {

        String extractedText = extractText(file);
        return processText(extractedText, query);
    }

    private String normalizeQuery(String query) {
        return (query == null || query.trim().isEmpty())
                ? DEFAULT_QUERY
                : query.trim();
    }

    private void sleep(int attempt) {
        try {
            Thread.sleep(500L * attempt);
        } catch (InterruptedException ignored) {}
    }
}
