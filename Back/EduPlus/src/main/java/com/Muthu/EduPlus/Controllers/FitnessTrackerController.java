package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Services.FitnessTrackerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fit")
public class FitnessTrackerController {
    @Autowired
    private FitnessTrackerService service;
}
