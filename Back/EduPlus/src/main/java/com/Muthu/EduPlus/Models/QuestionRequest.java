package com.Muthu.EduPlus.Models;

// Request body
public class QuestionRequest {
    private String text;
    private String qType; // "one mark", "two mark", "easy"
    private int count;

    // getters and setters
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getQType() { return qType; }
    public void setQType(String qType) { this.qType = qType; }

    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }
}


