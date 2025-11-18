package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Services.StudyPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/stu")
public class StudyPlanController {
    @Autowired
    private StudyPlanService service;

    @PostMapping("/send")
    public String sendTOProcess(@RequestBody Map<String, String> data) {
        return service.process(
                data.get("file"),
                data.get("query")
        );
    }

    @PostMapping("/extract-text")
    public String extractText(@RequestParam("file") MultipartFile file) throws Exception{
        return service.extractText(file);
    }

    @PostMapping("/send-direct-file")
    public String sendToProcess(
            @RequestParam("file") MultipartFile file,
            @RequestParam("query") String query)
            throws Exception {

        return service.process(file, query);

    }
}
