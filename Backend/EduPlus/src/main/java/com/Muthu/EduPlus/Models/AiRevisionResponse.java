package com.Muthu.EduPlus.Models;

import java.util.List;

public class AiRevisionResponse {
    private String summary;
    private List<String> keyPoints;
    private List<String> importantQuestions;
    private List<String> revisionTips;

    public AiRevisionResponse() {
    }

    public AiRevisionResponse(String summary, List<String> keyPoints, List<String> importantQuestions,
            List<String> revisionTips) {
        this.summary = summary;
        this.keyPoints = keyPoints;
        this.importantQuestions = importantQuestions;
        this.revisionTips = revisionTips;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getKeyPoints() {
        return keyPoints;
    }

    public void setKeyPoints(List<String> keyPoints) {
        this.keyPoints = keyPoints;
    }

    public List<String> getImportantQuestions() {
        return importantQuestions;
    }

    public void setImportantQuestions(List<String> importantQuestions) {
        this.importantQuestions = importantQuestions;
    }

    public List<String> getRevisionTips() {
        return revisionTips;
    }

    public void setRevisionTips(List<String> revisionTips) {
        this.revisionTips = revisionTips;
    }
}
