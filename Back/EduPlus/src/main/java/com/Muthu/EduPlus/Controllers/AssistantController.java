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

    // ── Existing general AI endpoint (unchanged) ────────────────────────────
    @PostMapping("/ask")
    public ChatResponse getChatResponse(@RequestBody String message) {
        return service.getAiResponse(message);
    }

    // ── New RAG / Syllabus-grounded endpoint ────────────────────────────────
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
}
