package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.ChatResponse;
import com.Muthu.EduPlus.Services.AssistantService;
import com.Muthu.EduPlus.Services.RagAssistantService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/ass")
public class AssistantController {

    private final AssistantService service;
    private final RagAssistantService ragAssistantService;

    public AssistantController(AssistantService service, RagAssistantService ragAssistantService) {
        this.service = service;
        this.ragAssistantService = ragAssistantService;
    }

    // General AI chat — receives full conversation history for session memory
    @PostMapping("/ask")
    public ChatResponse getChatResponse(@RequestBody Map<String, Object> body) {
        String message = (String) body.get("currentQuery");
        @SuppressWarnings("unchecked")
        java.util.List<String> history = (java.util.List<String>) body.getOrDefault("history",
                new java.util.ArrayList<>());
        return service.getAiResponseWithHistory(message, history);
    }

    // Syllabus-grounded chat
    @PostMapping("/ask-syllabus")
    public ResponseEntity<Map<String, String>> askSyllabus(
            @RequestBody Map<String, String> body) {

        String question = body.get("message");
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        String response = ragAssistantService.askWithSyllabus(username, question);
        return ResponseEntity.ok(Map.of("response", response));
    }

    // Personality analysis — extracts facts from user message and stores them
    @PostMapping("/analyze-personality")
    public ResponseEntity<Void> analyzePersonality(@RequestBody Map<String, String> body) {
        String message = body.get("message");
        if (message == null || message.isBlank())
            return ResponseEntity.ok().build();
        service.analyzeAndStorePersonality(message);
        return ResponseEntity.ok().build();
    }
}
