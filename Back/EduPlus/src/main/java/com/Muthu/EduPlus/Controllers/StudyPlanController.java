package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.QuestionRequest;
import com.Muthu.EduPlus.Models.QuestionResponse;
import com.Muthu.EduPlus.Services.StudyPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/stu")
public class StudyPlanController {
    @Autowired
    private StudyPlanService service;

    @PostMapping("/give")
    public Object ExtractText(@RequestBody String input) throws InterruptedException, IOException {
        return service.getResults(input);
    }

}
