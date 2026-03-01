package com.Muthu.EduPlus.Models;

import java.util.List;

public class AiAnalysisResponse {

    private List<String> weakTopics;
    private List<String> strongTopics;
    private List<String> recommendations;

    public AiAnalysisResponse() {}

    public AiAnalysisResponse(
            List<String> weakTopics,
            List<String> strongTopics,
            List<String> recommendations
    ) {
        this.weakTopics = weakTopics;
        this.strongTopics = strongTopics;
        this.recommendations = recommendations;
    }

    public List<String> getWeakTopics() {
        return weakTopics;
    }

    public void setWeakTopics(List<String> weakTopics) {
        this.weakTopics = weakTopics;
    }

    public List<String> getStrongTopics() {
        return strongTopics;
    }

    public void setStrongTopics(List<String> strongTopics) {
        this.strongTopics = strongTopics;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }
}
