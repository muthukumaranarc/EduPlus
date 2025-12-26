package com.Muthu.EduPlus.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "grammarConcepts")
public class GrammarConcepts {

    @Id
    private String username;
    private List<GrammarStructure> data;

    private GrammarConcepts() {}

    public GrammarConcepts(String username, List<GrammarStructure> data) {
        this.username = username;
        this.data = data;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<GrammarStructure> getData() {
        return data;
    }

    public void setData(List<GrammarStructure> data) {
        this.data = data;
    }
}
