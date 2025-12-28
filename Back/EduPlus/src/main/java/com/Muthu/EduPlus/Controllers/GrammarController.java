package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.ChatResponse;
import com.Muthu.EduPlus.Models.GrammarStructure;
import com.Muthu.EduPlus.Services.GrammarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/grammar")
public class GrammarController {

    @Autowired
    private GrammarService service;

    @PostMapping("/send-ai")
    public ChatResponse getResults(@RequestBody String message) {
        return service.getAiResponse(message);
    }

    @GetMapping("/get-all-topics")
    public List<GrammarStructure> getAll() {
        return service.getAllGrammarTopics();
    }

    @DeleteMapping("/delete-all-topics")
    public boolean deleteAll() {
        return service.deleteAllGrammarTopics();
    }

    @PostMapping("/add-topic")
    public boolean create(@RequestBody Map<String, String> data) {
        return service.addNewGrammarTopic(
                data.get("title"),
                data.get("content")
        );
    }

    @GetMapping("/get-topic/{title}")
    public GrammarStructure getOne(@PathVariable String title) {
        return service.getGrammarByTitle(title);
    }

    @PutMapping("/update-title")
    public boolean updateTitle(@RequestBody Map<String, String> data) {
        return service.updateTitle(
                data.get("oldTitle"),
                data.get("newTitle")
        );
    }

    @PutMapping("/update-content")
    public boolean updateContent(@RequestBody Map<String, String> data) {
        return service.updateContent(
                data.get("title"),
                data.get("content")
        );
    }

    @DeleteMapping("/delete-title/{title}")
    public boolean deleteOne(@PathVariable String title) {
        return service.deleteTitle(title);
    }
}
