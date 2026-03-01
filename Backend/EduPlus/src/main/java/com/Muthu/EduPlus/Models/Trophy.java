package com.Muthu.EduPlus.Models;

public class Trophy {
    private String id;
    private String name;
    private String description;
    private String icon;
    private boolean earned;
    private String earnedDate;
    private int currentProgress;
    private int requiredProgress;
    private String category; // "test", "score", "consistency", "contribution", "milestone"

    public Trophy() {
    }

    public Trophy(String id, String name, String description, String icon,
            int requiredProgress, String category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.earned = false;
        this.earnedDate = null;
        this.currentProgress = 0;
        this.requiredProgress = requiredProgress;
        this.category = category;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public boolean isEarned() {
        return earned;
    }

    public void setEarned(boolean earned) {
        this.earned = earned;
    }

    public String getEarnedDate() {
        return earnedDate;
    }

    public void setEarnedDate(String earnedDate) {
        this.earnedDate = earnedDate;
    }

    public int getCurrentProgress() {
        return currentProgress;
    }

    public void setCurrentProgress(int currentProgress) {
        this.currentProgress = currentProgress;
    }

    public int getRequiredProgress() {
        return requiredProgress;
    }

    public void setRequiredProgress(int requiredProgress) {
        this.requiredProgress = requiredProgress;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
