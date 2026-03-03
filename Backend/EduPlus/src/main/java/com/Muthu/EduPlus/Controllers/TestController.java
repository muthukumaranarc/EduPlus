package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.Question;
import com.Muthu.EduPlus.Models.UserTest;
import com.Muthu.EduPlus.Services.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private TestService service;

    /* ── Legacy: MCQ-only generation ── */
    @PostMapping("/generate/{questionCount}")
    public UserTest generateTestFromText(@PathVariable("questionCount") int questionCount, @RequestBody Map<String, String> data) {
        return service.generateTestFromText(
                data.get("groupName"),
                data.get("testTitle"),
                data.get("text"),
                questionCount
        );
    }

    /* ── New: Mixed question type generation ── */
    @PostMapping("/generate-mixed")
    public UserTest generateMixedTest(@RequestBody Map<String, Object> data) {
        String groupName  = (String) data.get("groupName");
        String testTitle  = (String) data.get("testTitle");
        String text       = (String) data.get("text");
        int mcqCount      = data.containsKey("mcqCount")      ? (int) data.get("mcqCount")      : 0;
        int twoMarkCount  = data.containsKey("twoMarkCount")  ? (int) data.get("twoMarkCount")  : 0;
        int tenMarkCount  = data.containsKey("tenMarkCount")  ? (int) data.get("tenMarkCount")  : 0;
        return service.generateMixedTest(groupName, testTitle, text, mcqCount, twoMarkCount, tenMarkCount);
    }

    /* ── New: Mixed type from file ── */
    @PostMapping("/generate-mixed-from-file")
    public UserTest generateMixedTestFromFile(
            @RequestParam String groupName,
            @RequestParam String testTitle,
            @RequestParam MultipartFile sourceText,
            @RequestParam(defaultValue = "5") int mcqCount,
            @RequestParam(defaultValue = "3") int twoMarkCount,
            @RequestParam(defaultValue = "2") int tenMarkCount
    ) throws Exception {
        return service.generateMixedTestFromFile(groupName, testTitle, sourceText, mcqCount, twoMarkCount, tenMarkCount);
    }

    /* ── Legacy: file-based MCQ only ── */
    @PostMapping("/generate-from-text")
    public UserTest generateTestFromText(
            @RequestParam String groupName,
            @RequestParam String testTitle,
            @RequestParam MultipartFile sourceText,
            @RequestParam int numberOfQuestions
    ) throws Exception {
        return service.generateTestFromText(groupName, testTitle, sourceText, numberOfQuestions);
    }

    /* ---------------- FETCH ---------------- */
    @GetMapping("/get-all-group")
    public UserTest getAllTests() { return service.getAllTests(); }

    /* ---------------- TEST GROUP ---------------- */
    @PostMapping("/create-group")
    public UserTest addTestGroup(@RequestBody String groupName) { return service.addTestGroup(groupName); }

    @DeleteMapping("/delete-group")
    public UserTest deleteTestGroup(@RequestBody String groupName) { return service.deleteTestGroup(groupName); }

    /* ---------------- TEST ---------------- */
    @PostMapping("/add-test")
    public UserTest addTest(@RequestBody Map<String, String> data) {
        return service.addTest(data.get("groupName"), data.get("title"));
    }

    @DeleteMapping("/delete-test")
    public UserTest deleteTest(@RequestBody Map<String, String> data) {
        return service.deleteTest(data.get("groupName"), data.get("title"));
    }

    /* ---------------- QUESTION ---------------- */
    @PostMapping("/group/{groupName}/test/{testTitle}")
    public UserTest addQuestion(
            @PathVariable String groupName,
            @PathVariable String testTitle,
            @RequestBody Question question
    ) {
        return service.addQuestion(groupName, testTitle, question);
    }

    @DeleteMapping("/group/{groupName}/test/{testTitle}/question/{questionIndex}")
    public UserTest deleteQuestion(
            @PathVariable String groupName,
            @PathVariable String testTitle,
            @PathVariable int questionIndex
    ) {
        return service.deleteQuestion(groupName, testTitle, questionIndex);
    }
}
