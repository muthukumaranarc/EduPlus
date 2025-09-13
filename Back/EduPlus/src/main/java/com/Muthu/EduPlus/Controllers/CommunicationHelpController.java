package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Services.CommunicationHelpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/com")
public class CommunicationHelpController {
    @Autowired
    private CommunicationHelpService service;
}
