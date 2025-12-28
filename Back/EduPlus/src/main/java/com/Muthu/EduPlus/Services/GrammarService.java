package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.ChatResponse;
import com.Muthu.EduPlus.Models.GrammarConcepts;
import com.Muthu.EduPlus.Models.GrammarStructure;
import com.Muthu.EduPlus.Repositories.GrammarRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GrammarService {

    @Autowired
    private AiModelService aiModelService;

    @Autowired
    private GrammarRepo grammarRepo;

    private static final String CHATBOT_PROMPT = """
    You are an AI assistant specialized in teaching English grammar.
    Be clear, friendly, and concise.
    """;

    public ChatResponse getAiResponse(String message) {
        return aiModelService.getAiResponse(message, CHATBOT_PROMPT, true);
    }

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }

    private GrammarConcepts getOrCreateUserData() {
        String username = getCurrentUsername();
        GrammarConcepts data = grammarRepo.findByUsername(username);

        if (data == null) {
            data = new GrammarConcepts(username, new ArrayList<>());
            grammarRepo.save(data);
        }
        return data;
    }

    public void deleteUser(String username) {
        if(grammarRepo.findByUsername(username) == null) return;
        grammarRepo.deleteById(username);
    }

    public void updateUsername(String currentName, String newName){
        if(grammarRepo.findByUsername(currentName) == null) return;
        GrammarConcepts userData = grammarRepo.findByUsername(currentName);

        grammarRepo.delete(userData);

        userData.setUsername(newName);
        grammarRepo.save(userData);
    }

    public List<GrammarStructure> getAllGrammarTopics() {
        return getOrCreateUserData().getData();
    }

    public boolean deleteAllGrammarTopics() {
        GrammarConcepts concepts = getOrCreateUserData();
        if (concepts.getData().isEmpty()) return false;

        concepts.getData().clear();
        grammarRepo.save(concepts);
        return true;
    }

    public boolean addNewGrammarTopic(String title, String content) {
        if (title == null || title.isBlank()) return false;

        GrammarConcepts concepts = getOrCreateUserData();
        List<GrammarStructure> list = concepts.getData();

        boolean exists = list.stream()
                .anyMatch(g -> title.equalsIgnoreCase(g.getTitle()));
        if (exists) return false;

        list.add(new GrammarStructure(title, content));
        grammarRepo.save(concepts);
        return true;
    }

    public GrammarStructure getGrammarByTitle(String title) {
        return getOrCreateUserData()
                .getData()
                .stream()
                .filter(g -> title.equalsIgnoreCase(g.getTitle()))
                .findFirst()
                .orElse(null);
    }

    public boolean updateTitle(String oldTitle, String newTitle) {
        if (newTitle == null || newTitle.isBlank()) return false;

        GrammarConcepts concepts = getOrCreateUserData();
        List<GrammarStructure> list = concepts.getData();

        boolean newExists = list.stream()
                .anyMatch(g -> newTitle.equalsIgnoreCase(g.getTitle()));
        if (newExists) return false;

        GrammarStructure item = list.stream()
                .filter(g -> oldTitle.equalsIgnoreCase(g.getTitle()))
                .findFirst()
                .orElse(null);

        if (item == null) return false;

        item.setTitle(newTitle);
        grammarRepo.save(concepts);
        return true;
    }

    public boolean updateContent(String title, String content) {
        GrammarConcepts concepts = getOrCreateUserData();

        GrammarStructure item = concepts.getData().stream()
                .filter(g -> title.equalsIgnoreCase(g.getTitle()))
                .findFirst()
                .orElse(null);

        if (item == null) return false;

        item.setContent(content);
        grammarRepo.save(concepts);
        return true;
    }

    public boolean deleteTitle(String title) {
        GrammarConcepts concepts = getOrCreateUserData();

        boolean removed = concepts.getData()
                .removeIf(g -> title.equalsIgnoreCase(g.getTitle()));

        if (!removed) return false;

        grammarRepo.save(concepts);
        return true;
    }
}
