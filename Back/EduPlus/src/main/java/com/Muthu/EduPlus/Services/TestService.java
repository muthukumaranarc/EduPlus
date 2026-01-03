package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.*;
import com.Muthu.EduPlus.Repositories.TestRepo;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class TestService {

    @Autowired
    private TestRepo data;

    @Autowired
    private AiModelService aiModelService;

    /* ---------------- UTIL ---------------- */
    private static final Logger log = LoggerFactory.getLogger(StudyPlanService.class);

    private String extractPureJson(String text) {
        text = text.replaceAll("(?s)```json", "")
                .replaceAll("(?s)```", "")
                .trim();

        int start = text.indexOf("[");
        int end = text.lastIndexOf("]");

        if (start == -1 || end == -1) {
            System.out.println(text);
            throw new RuntimeException("No JSON array found in AI response: ");
        }

        return text.substring(start, end + 1);
    }

    private String getUsername() {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }

    private UserTest getOrCreateUser() {
        String username = getUsername();
        return data.findById(username)
                .orElseGet(() ->
                        data.save(new UserTest(username, new ArrayList<>()))
                );
    }

    private UserTest getUserTest() {
        String username = getUsername();
        return data.findById(username)
                .orElse(new UserTest(username, new ArrayList<>()));
    }

    /* ---------------- AI TEST GENERATION ---------------- */

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

    private void sleep(int attempt) {
        try {
            Thread.sleep(500L * attempt);
        } catch (InterruptedException ignored) {}
    }

    public UserTest generateTestFromText(String groupName, String testTitle, MultipartFile sourceText, int numberOfQuestions) throws TikaException, IOException, SAXException {
        return generateTestFromText(groupName, testTitle, extractText(sourceText), numberOfQuestions);
    }

    public UserTest generateTestFromText(
            String groupName,
            String testTitle,
            String sourceText,
            int numberOfQuestions
    ) {
        UserTest userTest = getOrCreateUser();

        /* ---------- AI PROMPT ---------- */
        String chatbotPrompt =
                "You are a question paper generator.\n" +
                        "Create exactly " + numberOfQuestions + " multiple choice questions from the given text.\n\n" +
                        "Rules:\n" +
                        "1. Each question must have exactly 4 options\n" +
                        "2. The answer must be ONE of the options (exact text match)\n" +
                        "3. Output ONLY valid JSON\n" +
                        "4. Do NOT include explanations or extra text\n\n" +
                        "JSON format:\n" +
                        "[\n" +
                        "  {\n" +
                        "    \"question\": \"\",\n" +
                        "    \"options\": [\"\", \"\", \"\", \"\"],\n" +
                        "    \"answer\": \"\"\n" +
                        "  }\n" +
                        "]";

        /* ---------- CALL AI ---------- */
        ChatResponse aiResponse = aiModelService.getAiResponse(
                sourceText,
                chatbotPrompt,
                false
        );

        String aiJson = aiResponse.getResponse();

        /* ---------- PARSE JSON ---------- */
        ObjectMapper mapper = new ObjectMapper();
        List<Question> generatedQuestions;

        try {
            String cleanJson = extractPureJson(aiJson);
            generatedQuestions = mapper.readValue(
                    cleanJson,
                    new TypeReference<List<Question>>() {}
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response into questions", e);
        }

        /* ---------- STORE QUESTIONS (AUTO-CREATE LOGIC) ---------- */

        TestGroup targetGroup = null;

        for (TestGroup group : userTest.getTestGroup()) {
            if (group.getName().equals(groupName)) {
                targetGroup = group;
                break;
            }
        }

        // If group not found → create it
        if (targetGroup == null) {
            targetGroup = new TestGroup(new ArrayList<>(), groupName);
            userTest.getTestGroup().add(targetGroup);
        }

        Test targetTest = null;

        for (Test test : targetGroup.getGroup()) {
            if (test.getTitle().equals(testTitle)) {
                targetTest = test;
                break;
            }
        }

        // If test not found → create it
        if (targetTest == null) {
            targetTest = new Test(testTitle, new ArrayList<>());
            targetGroup.getGroup().add(targetTest);
        }

        // Add generated questions
        targetTest.getQuestionSet().addAll(generatedQuestions);

        return data.save(userTest);
    }

    /* ---------------- TEST GROUP ---------------- */

    public UserTest addTestGroup(String groupName) {
        UserTest userTest = getOrCreateUser();
        userTest.getTestGroup().add(new TestGroup(new ArrayList<>(), groupName));
        return data.save(userTest);
    }

    public UserTest deleteTestGroup(String groupName) {
        UserTest userTest = getUserTest();
        userTest.getTestGroup().removeIf(
                group -> group.getName().equals(groupName)
        );
        return data.save(userTest);
    }

    /* ---------------- TEST ---------------- */

    public UserTest addTest(String groupName, String testTitle) {
        UserTest userTest = getUserTest();

        for (TestGroup group : userTest.getTestGroup()) {
            if (group.getName().equals(groupName)) {
                boolean exists = group.getGroup().stream()
                        .anyMatch(t -> t.getTitle().equals(testTitle));

                if (!exists) {
                    group.getGroup().add(new Test(testTitle, new ArrayList<>()));
                }
                break;
            }
        }
        return data.save(userTest);
    }

    public UserTest deleteTest(String groupName, String testTitle) {
        UserTest userTest = getUserTest();

        for (TestGroup group : userTest.getTestGroup()) {
            if (group.getName().equals(groupName)) {
                group.getGroup().removeIf(
                        test -> test.getTitle().equals(testTitle)
                );
                break;
            }
        }
        return data.save(userTest);
    }

    /* ---------------- QUESTION ---------------- */

    public UserTest addQuestion(
            String groupName,
            String testTitle,
            Question question
    ) {
        UserTest userTest = getUserTest();

        for (TestGroup group : userTest.getTestGroup()) {
            if (group.getName().equals(groupName)) {
                for (Test test : group.getGroup()) {
                    if (test.getTitle().equals(testTitle)) {
                        test.getQuestionSet().add(question);
                        return data.save(userTest);
                    }
                }
            }
        }
        return userTest;
    }

    public UserTest deleteQuestion(
            String groupName,
            String testTitle,
            int questionIndex
    ) {
        UserTest userTest = getUserTest();

        for (TestGroup group : userTest.getTestGroup()) {
            if (group.getName().equals(groupName)) {
                for (Test test : group.getGroup()) {
                    if (test.getTitle().equals(testTitle)) {
                        if (questionIndex >= 0 &&
                                questionIndex < test.getQuestionSet().size()) {
                            test.getQuestionSet().remove(questionIndex);
                        }
                        return data.save(userTest);
                    }
                }
            }
        }
        return userTest;
    }

    /* ---------------- FETCH ---------------- */

    public UserTest getAllTests() {
        return getUserTest();
    }
}
