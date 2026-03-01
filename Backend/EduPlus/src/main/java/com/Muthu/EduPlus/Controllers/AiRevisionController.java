package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.AiRevisionResponse;
import com.Muthu.EduPlus.Services.AiRevisionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AiRevisionController {

    private final AiRevisionService aiRevisionService;

    public AiRevisionController(AiRevisionService aiRevisionService) {
        this.aiRevisionService = aiRevisionService;
    }

    @PostMapping("/generate-revision")
    public ResponseEntity<AiRevisionResponse> generateRevision(@RequestBody Map<String, String> payload) {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        String subject = payload.get("subject");

        if (subject == null || subject.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        AiRevisionResponse response = aiRevisionService.generateRevision(username, subject);

        return ResponseEntity.ok(response);
    }
}
