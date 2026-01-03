package com.Muthu.EduPlus.Models;

import java.util.List;

public class Test {
    private String title;
    private List<Question> questionSet;

    private Test() {};

    public Test(String title, List<Question> questionSet) {
        this.title = title;
        this.questionSet = questionSet;
    }

    public List<Question> getQuestionSet() {
        return questionSet;
    }

    public void setQuestionSet(List<Question> questionSet) {
        this.questionSet = questionSet;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
