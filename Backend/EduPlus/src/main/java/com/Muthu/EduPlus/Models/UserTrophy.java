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
        private int totalEarned; // Total trophy count for leaderboard ranking

        /**
         * ISO date string (yyyy-MM-dd) of the Monday that started the current
         * trophy week. Null for brand-new documents — the service will set it on
         * the first access.
         */
        private String weekStartDate;

        public UserTrophy() {
                this.trophies = new ArrayList<>();
                this.testsCompleted = 0;
                this.highScoreCount = 0;
                this.currentStreak = 0;
                this.materialsUploaded = 0;
                this.milestonesReached = 0;
                this.totalEarned = 0;
                this.weekStartDate = null;
        }

        public UserTrophy(String username) {
                this.username = username;
                this.trophies = initializeTrophies();
                this.testsCompleted = 0;
                this.highScoreCount = 0;
                this.currentStreak = 0;
                this.materialsUploaded = 0;
                this.milestonesReached = 0;
                this.totalEarned = 0;
                this.weekStartDate = null;
        }

        /**
         * Full 50-trophy set.
         *
         * Thresholds are designed around weekly play — all are achievable in 7 days.
         * The streak category uses the global consecutive-day streak, capped at 7
         * (one full perfect week). Every other counter is reset to 0 on Monday.
         *
         * Category counts: Tests (12) + Score (10) + Streak (7) + Contribution (9)
         * + Milestone (12) = 50
         */
        private List<Trophy> initializeTrophies() {
                List<Trophy> t = new ArrayList<>();

                // ── Tests this week (12) ──────────────────────────────────────
                t.add(new Trophy("test_1", "First Step", "Complete 1 test this week", "🏅", 1, "test"));
                t.add(new Trophy("test_2", "Getting Started", "Complete 2 tests this week", "📋", 2, "test"));
                t.add(new Trophy("test_3", "Learner", "Complete 3 tests this week", "🎖️", 3, "test"));
                t.add(new Trophy("test_4", "Curious Mind", "Complete 4 tests this week", "🔍", 4, "test"));
                t.add(new Trophy("test_5", "Achiever", "Complete 5 tests this week", "🏆", 5, "test"));
                t.add(new Trophy("test_7", "Dedicated", "Complete 7 tests this week", "💪", 7, "test"));
                t.add(new Trophy("test_8", "Persistent", "Complete 8 tests this week", "🎯", 8, "test"));
                t.add(new Trophy("test_10", "Veteran", "Complete 10 tests this week", "🌟", 10, "test"));
                t.add(new Trophy("test_12", "Expert", "Complete 12 tests this week", "🔱", 12, "test"));
                t.add(new Trophy("test_15", "Test Master", "Complete 15 tests this week", "👑", 15, "test"));
                t.add(new Trophy("test_20", "Champion", "Complete 20 tests this week", "🦁", 20, "test"));
                t.add(new Trophy("test_25", "Weekly Legend", "Complete 25 tests this week", "🎇", 25, "test"));

                // ── High Scores this week (10) ───────────────────────────────
                t.add(new Trophy("score_1", "Excellence", "Score 90%+ in 1 test this week", "⭐", 1, "score"));
                t.add(new Trophy("score_2", "Rising Star", "Score 90%+ in 2 tests this week", "🌟", 2, "score"));
                t.add(new Trophy("score_3", "Star Performer", "Score 90%+ in 3 tests this week", "🌠", 3, "score"));
                t.add(new Trophy("score_4", "High Achiever", "Score 90%+ in 4 tests this week", "💡", 4, "score"));
                t.add(new Trophy("score_5", "Academic Elite", "Score 90%+ in 5 tests this week", "💎", 5, "score"));
                t.add(new Trophy("score_6", "Ace Student", "Score 90%+ in 6 tests this week", "⚡", 6, "score"));
                t.add(new Trophy("score_7", "Score Warrior", "Score 90%+ in 7 tests this week", "🔥", 7, "score"));
                t.add(new Trophy("score_8", "Elite Scorer", "Score 90%+ in 8 tests this week", "🎖️", 8, "score"));
                t.add(new Trophy("score_10", "Perfectionist", "Score 90%+ in 10 tests this week", "🎯", 10, "score"));
                t.add(new Trophy("score_12", "Score Legend", "Score 90%+ in 12 tests this week", "👑", 12, "score"));

                // ── Streak — consecutive study days (7) ───────────────────────
                t.add(new Trophy("streak_1", "Day One", "Study for 1 consecutive day", "🌱", 1, "consistency"));
                t.add(new Trophy("streak_2", "Duo", "Study for 2 consecutive days", "🔥", 2, "consistency"));
                t.add(new Trophy("streak_3", "Trio", "Study for 3 consecutive days", "⚡", 3, "consistency"));
                t.add(new Trophy("streak_4", "Consistent", "Study for 4 consecutive days", "💪", 4, "consistency"));
                t.add(new Trophy("streak_5", "On Fire", "Study for 5 consecutive days", "🌞", 5, "consistency"));
                t.add(new Trophy("streak_6", "Almost Perfect", "Study for 6 consecutive days", "🌙", 6, "consistency"));
                t.add(new Trophy("streak_7", "Week Warrior", "Maintain a perfect 7-day streak", "🗓️", 7,
                                "consistency"));

                // ── Contributions this week (9) ────────────────────────────────
                t.add(new Trophy("contrib_1", "First Upload", "Upload 1 material this week", "📚", 1, "contribution"));
                t.add(new Trophy("contrib_2", "Sharer", "Upload 2 materials this week", "📖", 2, "contribution"));
                t.add(new Trophy("contrib_3", "Content Creator", "Upload 3 materials this week", "✍️", 3,
                                "contribution"));
                t.add(new Trophy("contrib_4", "Educator", "Upload 4 materials this week", "🎓", 4, "contribution"));
                t.add(new Trophy("contrib_5", "Knowledge Sharer", "Upload 5 materials this week", "📝", 5,
                                "contribution"));
                t.add(new Trophy("contrib_6", "Library Builder", "Upload 6 materials this week", "🗂️", 6,
                                "contribution"));
                t.add(new Trophy("contrib_7", "Academic Writer", "Upload 7 materials this week", "📜", 7,
                                "contribution"));
                t.add(new Trophy("contrib_8", "Scholar", "Upload 8 materials this week", "🏛️", 8, "contribution"));
                t.add(new Trophy("contrib_10", "Content Legend", "Upload 10 materials this week", "🌐", 10,
                                "contribution"));

                // ── Milestones this week (12) ──────────────────────────────────
                t.add(new Trophy("mile_1", "Milestone I", "Reach 1 milestone this week", "🥉", 1, "milestone"));
                t.add(new Trophy("mile_2", "Milestone II", "Reach 2 milestones this week", "🎖️", 2, "milestone"));
                t.add(new Trophy("mile_3", "Milestone III", "Reach 3 milestones this week", "🏅", 3, "milestone"));
                t.add(new Trophy("mile_4", "Milestone IV", "Reach 4 milestones this week", "🥈", 4, "milestone"));
                t.add(new Trophy("mile_5", "Bronze Master", "Reach 5 milestones this week", "🥇", 5, "milestone"));
                t.add(new Trophy("mile_6", "Milestone VI", "Reach 6 milestones this week", "💠", 6, "milestone"));
                t.add(new Trophy("mile_7", "Silver Seeker", "Reach 7 milestones this week", "🏵️", 7, "milestone"));
                t.add(new Trophy("mile_8", "Progress Pursuer", "Reach 8 milestones this week", "🌟", 8, "milestone"));
                t.add(new Trophy("mile_10", "Gold Collector", "Reach 10 milestones this week", "💎", 10, "milestone"));
                t.add(new Trophy("mile_12", "Platinum Chaser", "Reach 12 milestones this week", "👑", 12, "milestone"));
                t.add(new Trophy("mile_15", "Diamond Hunter", "Reach 15 milestones this week", "🔱", 15, "milestone"));
                t.add(new Trophy("mile_20", "Milestone Legend", "Reach 20 milestones this week", "✨", 20, "milestone"));

                return t;
        }

        // ── Getters and Setters ───────────────────────────────────────────────

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

        public int getTotalEarned() {
                return totalEarned;
        }

        public void setTotalEarned(int totalEarned) {
                this.totalEarned = totalEarned;
        }

        public String getWeekStartDate() {
                return weekStartDate;
        }

        public void setWeekStartDate(String weekStartDate) {
                this.weekStartDate = weekStartDate;
        }
}
