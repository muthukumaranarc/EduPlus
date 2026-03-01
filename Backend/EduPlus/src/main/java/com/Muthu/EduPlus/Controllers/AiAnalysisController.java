package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.AiAnalysisResponse;
import com.Muthu.EduPlus.Services.AiAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
public class AiAnalysisController {

    private final AiAnalysisService aiAnalysisService;

    public AiAnalysisController(AiAnalysisService aiAnalysisService) {
        this.aiAnalysisService = aiAnalysisService;
    }

    /**
     * POST /ai/analyze-progress
     *
     * Authentication: required (JWT cookie handled by JwtFilter)
     * Returns: AiAnalysisResponse JSON with weakTopics, strongTopics, recommendations
     */
    @PostMapping("/analyze-progress")
    public ResponseEntity<AiAnalysisResponse> analyzeProgress() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        AiAnalysisResponse response = aiAnalysisService.analyzeWeakness(username);

        return ResponseEntity.ok(response);
    }
}
