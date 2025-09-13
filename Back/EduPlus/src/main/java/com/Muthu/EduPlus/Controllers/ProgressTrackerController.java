package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Services.ProgressTrackerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pro")
public class ProgressTrackerController {
    @Autowired
    private ProgressTrackerService service;
}
