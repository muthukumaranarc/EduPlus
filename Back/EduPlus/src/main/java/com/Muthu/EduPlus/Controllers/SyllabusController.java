package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.Syllabus;
import com.Muthu.EduPlus.Services.SyllabusService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/syllabus")
public class SyllabusController {

    private final SyllabusService syllabusService;

    public SyllabusController(SyllabusService syllabusService) {
        this.syllabusService = syllabusService;
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    @PostMapping("/upload")
    public ResponseEntity<Syllabus> uploadSyllabus(@RequestBody Map<String, String> data) {
        String username = getCurrentUsername();
        Syllabus saved = syllabusService.uploadSyllabus(
                username,
                data.get("subject"),
                data.get("unit"),
                data.get("topic"),
                data.get("content"));
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<Syllabus>> getAllSyllabus() {
        String username = getCurrentUsername();
        return ResponseEntity.ok(syllabusService.getAllSyllabus(username));
    }

    @GetMapping("/get-subjects")
    public ResponseEntity<List<String>> getSubjects() {
        String username = getCurrentUsername();
        return ResponseEntity.ok(syllabusService.getSubjects(username));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteSyllabus(@PathVariable String id) {
        String username = getCurrentUsername();
        boolean deleted = syllabusService.deleteSyllabus(id, username);
        return ResponseEntity.ok(deleted);
    }
}
