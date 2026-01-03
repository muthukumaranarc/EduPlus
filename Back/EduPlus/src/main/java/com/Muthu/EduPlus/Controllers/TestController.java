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

    @PostMapping("/generate/{questionCount}")
    public UserTest generateTestFromText(@PathVariable("questionCount") int questionCount, @RequestBody Map<String, String> data) {
        return service.generateTestFromText(
                data.get("groupName"),
                data.get("testTitle"),
                data.get("text"),
                questionCount
        );
    }

    @PostMapping("/generate-from-text")
    public UserTest generateTestFromText(
            @RequestParam String groupName,
            @RequestParam String testTitle,
            @RequestParam MultipartFile sourceText,
            @RequestParam int numberOfQuestions
    ) throws Exception {

        return service.generateTestFromText(
                groupName,
                testTitle,
                sourceText,
                numberOfQuestions
        );
    }

    /* ---------------- FETCH ---------------- */

    // Fetch all test groups, tests, and questions for the logged-in user
    @GetMapping("/get-all-group")
    public UserTest getAllTests() {
        return service.getAllTests();
    }

    /* ---------------- TEST GROUP ---------------- */

    // Create a new test group for the logged-in user
    @PostMapping("/create-group")
    public UserTest addTestGroup(@RequestBody String groupName) {
        return service.addTestGroup(groupName);
    }

    // Delete a test group (and all its tests) using group index
    @DeleteMapping("/delete-group")
    public UserTest deleteTestGroup(@RequestBody String groupName) {
        return service.deleteTestGroup(groupName);
    }

    /* ---------------- TEST ---------------- */

    // Add a new test inside a specific test group
    @PostMapping("/add-test")
    public UserTest addTest(@RequestBody Map<String, String> data) {
        return service.addTest(
                data.get("groupName"),
                data.get("title")
        );
    }

    // Delete a specific test from a test group
    @DeleteMapping("/delete-test")
    public UserTest deleteTest(@RequestBody Map<String, String> data) {
        return service.deleteTest(
                data.get("groupName"),
                data.get("title")
        );
    }

    /* ---------------- QUESTION ---------------- */

    // Add a question (with options and correct answer) to a test
    @PostMapping("/group/{groupName}/test/{testTitle}")
    public UserTest addQuestion(
            @PathVariable String groupName,
            @PathVariable String testTitle,
            @RequestBody Question question
    ) {
        return service.addQuestion(groupName, testTitle, question);
    }

    // Delete a question from a test using question index
    @DeleteMapping("/group/{groupName}/test/{testTitle}/question/{questionIndex}")
    public UserTest deleteQuestion(
            @PathVariable String groupName,
            @PathVariable String testTitle,
            @PathVariable int questionIndex
    ) {
        return service.deleteQuestion(groupName, testTitle, questionIndex);
    }
}
