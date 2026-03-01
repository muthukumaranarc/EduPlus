package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.ChatResponse;
import com.Muthu.EduPlus.Models.StudyPlanRequest;
import com.Muthu.EduPlus.Services.StudyPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/stu")
public class StudyPlanController {

    @Autowired
    private StudyPlanService service;

    @PostMapping("/send")
    public ResponseEntity<?> sendText(@RequestBody StudyPlanRequest request) {

        ChatResponse response = service.processText(
                request.getFile(),
                request.getQuery()
        );

        return response.getStatus().equals("true")
                ? ResponseEntity.ok(response)
                : ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/extract-text")
    public ResponseEntity<?> extractText(@RequestParam("file") MultipartFile file)
            throws Exception {

        return ResponseEntity.ok(service.extractText(file));
    }

    @PostMapping("/send-direct-file")
    public ResponseEntity<?> sendFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "query", required = false) String query)
            throws Exception {

        ChatResponse response = service.processFile(file, query);

        return response.getStatus().equals("true")
                ? ResponseEntity.ok(response)
                : ResponseEntity.badRequest().body(response);
    }
}
