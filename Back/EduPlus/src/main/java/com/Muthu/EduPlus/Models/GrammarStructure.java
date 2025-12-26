package com.Muthu.EduPlus.Models;

import org.springframework.stereotype.Component;

@Component
public class GrammarStructure {

    private String title;
    private String content;

    public GrammarStructure() {}

    public GrammarStructure(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "GrammarStructure{" +
                "title='" + title + '\'' +
                ", content='" + content + '\'' +
                '}';
    }
}
