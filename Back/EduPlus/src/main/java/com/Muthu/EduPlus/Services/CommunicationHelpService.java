package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.ChatRequest;
import com.Muthu.EduPlus.Models.ChatResponse;
import com.Muthu.EduPlus.Models.GrammarConcepts;
import com.Muthu.EduPlus.Models.GrammarStructure;
import com.Muthu.EduPlus.Repositories.GrammarRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommunicationHelpService {

    @Autowired
    private AiModelService aiModelService;

    @Autowired
    private GrammarRepo grammarRepo;


    private static final String CHATBOT_PROMPT = """
    You are an AI assistant specialized in teaching and generating English grammar topics.
    Personality traits:
    - Friendly and professional
    - Clear, patient, and highly understandable
    - Expert in English grammar concepts, rules, examples, and explanations
    - Able to break down complex grammar topics into simple, easy-to-learn points
    - Always provide accurate information, examples, and short practice questions when useful
    - If asked for unrelated information, gently guide the user back to English learning
    - Keep responses concise but educational
    - Use emojis occasionally to stay friendly (but not overuse them)
    Always maintain conversation context.
    """;

    public ChatResponse getAiResponse(String message) {
        return aiModelService.getAiResponse(message, CHATBOT_PROMPT, true);
    }

    public String addGrammarTopic(String title, String content) {
        GrammarConcepts currentUserData = grammarRepo.findByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName()
        );
        List<GrammarStructure> grammarData = currentUserData.getData();
        grammarData.add(new GrammarStructure(title, content));
        currentUserData.setData(grammarData);
        grammarRepo.save(currentUserData);
        return "data added!";
    }

    public String updateTitle(String oldTitle, String newTitle){
        GrammarConcepts currentUserData = grammarRepo.findByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName()
        );
        List<GrammarStructure> grammarData = currentUserData.getData();

        List<GrammarStructure> uniqueList =
                grammarData.stream()
                        .collect(Collectors.toMap(
                                GrammarStructure::getTitle,
                                f -> f,
                                (existing, duplicate) -> existing
                        ))
                        .values()
                        .stream()
                        .toList();

        System.out.println(uniqueList);
        return  "a";
    }

//    Add all CRUD operations\

}
