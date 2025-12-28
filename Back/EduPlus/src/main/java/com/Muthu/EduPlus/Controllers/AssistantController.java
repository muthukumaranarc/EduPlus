package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.ChatResponse;
import com.Muthu.EduPlus.Services.AssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ass")
public class AssistantController {

    @Autowired
    private AssistantService service;

    @PostMapping("/ask")
    public ChatResponse getChatResponse(@RequestBody String message) {
        return service.getAiResponse(message);
    }

}
