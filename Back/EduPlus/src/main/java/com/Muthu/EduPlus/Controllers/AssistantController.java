package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Services.AssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ass")
public class AssistantController {
    @Autowired
    private AssistantService service;
}
