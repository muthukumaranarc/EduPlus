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
                .orElseGet(() -> data.save(new UserTest(username, new ArrayList<>())));
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
        } catch (InterruptedException ignored) {
        }
    }

    public UserTest generateTestFromText(String groupName, String testTitle, MultipartFile sourceText,
            int numberOfQuestions) throws TikaException, IOException, SAXException {
        return generateTestFromText(groupName, testTitle, extractText(sourceText), numberOfQuestions);
    }

    public UserTest generateTestFromText(
            String groupName,
            String testTitle,
            String sourceText,
            int numberOfQuestions) {
        UserTest userTest = getOrCreateUser();

        /* ---------- AI PROMPT (legacy MCQ-only) ---------- */
        String chatbotPrompt = "You are a question paper generator.\n" +
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
                "    \"answer\": \"\",\n" +
                "    \"type\": \"MCQ\"\n" +
                "  }\n" +
                "]";

        ChatResponse aiResponse = aiModelService.getAiResponse(sourceText, chatbotPrompt, false);
        String aiJson = aiResponse.getResponse();

        ObjectMapper mapper = new ObjectMapper();
        List<Question> generatedQuestions;
        try {
            String cleanJson = extractPureJson(aiJson);
            generatedQuestions = mapper.readValue(cleanJson, new TypeReference<List<Question>>() {
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response into questions", e);
        }

        return saveQuestionsToTest(userTest, groupName, testTitle, generatedQuestions);
    }

    /* ---------- MIXED QUESTION GENERATION ---------- */

    public UserTest generateMixedTestFromFile(String groupName, String testTitle, MultipartFile sourceText,
            int mcqCount, int twoMarkCount, int tenMarkCount)
            throws TikaException, IOException, SAXException {
        return generateMixedTest(groupName, testTitle, extractText(sourceText), mcqCount, twoMarkCount, tenMarkCount);
    }

    public UserTest generateMixedTest(String groupName, String testTitle, String sourceText,
            int mcqCount, int twoMarkCount, int tenMarkCount) {
        UserTest userTest = getOrCreateUser();

        /* ---------- BUILD PROMPT ---------- */
        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert question paper generator.\n");
        sb.append("Generate the following questions from the given text:\n");
        if (mcqCount > 0)
            sb.append("- ").append(mcqCount)
                    .append(" MCQ questions (4 options each, answer must be one of the options)\n");
        if (twoMarkCount > 0)
            sb.append("- ").append(twoMarkCount)
                    .append(" 2-Mark short-answer questions (concise answer, 2-3 sentences)\n");
        if (tenMarkCount > 0)
            sb.append("- ").append(tenMarkCount)
                    .append(" 10-Mark long-answer questions (detailed answer, key points)\n");
        sb.append("\nRules:\n");
        sb.append("1. Output ONLY a valid JSON array\n");
        sb.append("2. Do NOT include any explanations or extra text outside the JSON\n");
        sb.append("3. Use the exact 'type' values: \"MCQ\", \"TWO_MARKS\", \"TEN_MARKS\"\n");
        sb.append("4. For MCQ: include 'options' array with exactly 4 strings and 'answer' as one of those strings\n");
        sb.append(
                "5. For TWO_MARKS and TEN_MARKS: 'options' should be null or empty, 'answer' is the model answer\n\n");
        sb.append("JSON format:\n");
        sb.append("[\n");
        sb.append(
                "  { \"question\": \"\", \"options\": [\"\",\"\",\"\",\"\"], \"answer\": \"\", \"type\": \"MCQ\" },\n");
        sb.append("  { \"question\": \"\", \"options\": null, \"answer\": \"\", \"type\": \"TWO_MARKS\" },\n");
        sb.append("  { \"question\": \"\", \"options\": null, \"answer\": \"\", \"type\": \"TEN_MARKS\" }\n");
        sb.append("]");

        ChatResponse aiResponse = aiModelService.getAiResponse(sourceText, sb.toString(), false);
        String aiJson = aiResponse.getResponse();

        ObjectMapper mapper = new ObjectMapper();
        List<Question> generatedQuestions;
        try {
            String cleanJson = extractPureJson(aiJson);
            generatedQuestions = mapper.readValue(cleanJson, new TypeReference<List<Question>>() {
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI mixed response into questions", e);
        }

        return saveQuestionsToTest(userTest, groupName, testTitle, generatedQuestions);
    }

    /* ---------- SHARED SAVE HELPER ---------- */
    private UserTest saveQuestionsToTest(UserTest userTest, String groupName, String testTitle,
            List<Question> generatedQuestions) {
        TestGroup targetGroup = null;
        for (TestGroup group : userTest.getTestGroup()) {
            if (group.getName().equals(groupName)) {
                targetGroup = group;
                break;
            }
        }
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
        if (targetTest == null) {
            targetTest = new Test(testTitle, new ArrayList<>());
            targetGroup.getGroup().add(targetTest);
        }

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
                group -> group.getName().equals(groupName));
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
                        test -> test.getTitle().equals(testTitle));
                break;
            }
        }
        return data.save(userTest);
    }

    /* ---------------- QUESTION ---------------- */

    public UserTest addQuestion(
            String groupName,
            String testTitle,
            Question question) {
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
            int questionIndex) {
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
