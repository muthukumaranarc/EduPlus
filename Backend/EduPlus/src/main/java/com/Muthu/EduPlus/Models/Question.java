package com.Muthu.EduPlus.Models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Question {
    private String question;
    private List<String> options;   // only populated for MCQ
    private String answer;
    private String type;            // "MCQ" | "TWO_MARKS" | "TEN_MARKS"

    public Question() {}

    public Question(String question, List<String> options, String answer, String type) {
        this.question = question;
        this.options  = options;
        this.answer   = answer;
        this.type     = type;
    }

    public String getQuestion() { return question; }
    public void   setQuestion(String question) { this.question = question; }

    public List<String> getOptions() { return options; }
    public void         setOptions(List<String> options) { this.options = options; }

    public String getAnswer() { return answer; }
    public void   setAnswer(String answer) { this.answer = answer; }

    public String getType() { return type; }
    public void   setType(String type) { this.type = type; }
}
