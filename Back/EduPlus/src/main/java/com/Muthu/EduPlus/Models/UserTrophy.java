package com.Muthu.EduPlus.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "userTrophies")
public class UserTrophy {

    @Id
    private String username;
    private List<Trophy> trophies;
    private int testsCompleted;
    private int highScoreCount;
    private int currentStreak;
    private int materialsUploaded;
    private int milestonesReached;

    public UserTrophy() {
        this.trophies = new ArrayList<>();
        this.testsCompleted = 0;
        this.highScoreCount = 0;
        this.currentStreak = 0;
        this.materialsUploaded = 0;
        this.milestonesReached = 0;
    }

    public UserTrophy(String username) {
        this.username = username;
        this.trophies = initializeTrophies();
        this.testsCompleted = 0;
        this.highScoreCount = 0;
        this.currentStreak = 0;
        this.materialsUploaded = 0;
        this.milestonesReached = 0;
    }

    private List<Trophy> initializeTrophies() {
        List<Trophy> trophyList = new ArrayList<>();

        // Test Completion Trophies
        trophyList.add(new Trophy("beginner", "Beginner",
                "Complete your first test", "🏅", 1, "test"));
        trophyList.add(new Trophy("learner", "Learner",
                "Complete 5 tests", "🎖️", 5, "test"));
        trophyList.add(new Trophy("achiever", "Achiever",
                "Complete 10 tests", "🏆", 10, "test"));

        // High Score Trophies
        trophyList.add(new Trophy("excellence", "Excellence",
                "Score 90% or above in a test", "⭐", 1, "score"));

        // Consistency Trophies
        trophyList.add(new Trophy("consistency", "Consistency",
                "Study for 5 consecutive days", "🔥", 5, "consistency"));

        // Contribution Trophies
        trophyList.add(new Trophy("contributor", "Contributor",
                "Upload study material", "📚", 1, "contribution"));

        // Milestone Trophies
        trophyList.add(new Trophy("milestone_bronze", "Bronze Milestone",
                "Reach 5 milestone achievements", "🥉", 5, "milestone"));
        trophyList.add(new Trophy("milestone_silver", "Silver Milestone",
                "Reach 10 milestone achievements", "🥈", 10, "milestone"));
        trophyList.add(new Trophy("milestone_gold", "Gold Milestone",
                "Reach 20 milestone achievements", "🥇", 20, "milestone"));

        return trophyList;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<Trophy> getTrophies() {
        return trophies;
    }

    public void setTrophies(List<Trophy> trophies) {
        this.trophies = trophies;
    }

    public int getTestsCompleted() {
        return testsCompleted;
    }

    public void setTestsCompleted(int testsCompleted) {
        this.testsCompleted = testsCompleted;
    }

    public int getHighScoreCount() {
        return highScoreCount;
    }

    public void setHighScoreCount(int highScoreCount) {
        this.highScoreCount = highScoreCount;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public int getMaterialsUploaded() {
        return materialsUploaded;
    }

    public void setMaterialsUploaded(int materialsUploaded) {
        this.materialsUploaded = materialsUploaded;
    }

    public int getMilestonesReached() {
        return milestonesReached;
    }

    public void setMilestonesReached(int milestonesReached) {
        this.milestonesReached = milestonesReached;
    }
}
