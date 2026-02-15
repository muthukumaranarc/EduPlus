package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.Trophy;
import com.Muthu.EduPlus.Models.UserTrophy;
import com.Muthu.EduPlus.Repositories.TrophyRepo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class TrophyService {

    private final TrophyRepo trophyRepo;

    public TrophyService(TrophyRepo trophyRepo) {
        this.trophyRepo = trophyRepo;
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    public UserTrophy getUserTrophies() {
        String username = getCurrentUsername();
        UserTrophy userTrophy = trophyRepo.findByUsername(username);

        if (userTrophy == null) {
            userTrophy = new UserTrophy(username);
            trophyRepo.save(userTrophy);
        }

        return userTrophy;
    }

    public UserTrophy getUserTrophiesByUsername(String username) {
        UserTrophy userTrophy = trophyRepo.findByUsername(username);

        if (userTrophy == null) {
            userTrophy = new UserTrophy(username);
            trophyRepo.save(userTrophy);
        }

        return userTrophy;
    }

    public void updateTestProgress(int testsCompleted) {
        String username = getCurrentUsername();
        UserTrophy userTrophy = getUserTrophies();

        userTrophy.setTestsCompleted(testsCompleted);
        checkAndAwardTrophies(userTrophy);
        trophyRepo.save(userTrophy);
    }

    public void incrementTestCompleted() {
        String username = getCurrentUsername();
        UserTrophy userTrophy = getUserTrophies();

        userTrophy.setTestsCompleted(userTrophy.getTestsCompleted() + 1);
        checkAndAwardTrophies(userTrophy);
        trophyRepo.save(userTrophy);
    }

    public void recordHighScore() {
        String username = getCurrentUsername();
        UserTrophy userTrophy = getUserTrophies();

        userTrophy.setHighScoreCount(userTrophy.getHighScoreCount() + 1);
        checkAndAwardTrophies(userTrophy);
        trophyRepo.save(userTrophy);
    }

    public void updateStreak(int streak) {
        String username = getCurrentUsername();
        UserTrophy userTrophy = getUserTrophies();

        userTrophy.setCurrentStreak(streak);
        checkAndAwardTrophies(userTrophy);
        trophyRepo.save(userTrophy);
    }

    public void incrementMaterialUploaded() {
        String username = getCurrentUsername();
        UserTrophy userTrophy = getUserTrophies();

        userTrophy.setMaterialsUploaded(userTrophy.getMaterialsUploaded() + 1);
        checkAndAwardTrophies(userTrophy);
        trophyRepo.save(userTrophy);
    }

    public void incrementMilestone() {
        String username = getCurrentUsername();
        UserTrophy userTrophy = getUserTrophies();

        userTrophy.setMilestonesReached(userTrophy.getMilestonesReached() + 1);
        checkAndAwardTrophies(userTrophy);
        trophyRepo.save(userTrophy);
    }

    private void checkAndAwardTrophies(UserTrophy userTrophy) {
        List<Trophy> trophies = userTrophy.getTrophies();

        for (Trophy trophy : trophies) {
            if (!trophy.isEarned()) {
                int currentProgress = 0;

                switch (trophy.getCategory()) {
                    case "test":
                        currentProgress = userTrophy.getTestsCompleted();
                        break;
                    case "score":
                        currentProgress = userTrophy.getHighScoreCount();
                        break;
                    case "consistency":
                        currentProgress = userTrophy.getCurrentStreak();
                        break;
                    case "contribution":
                        currentProgress = userTrophy.getMaterialsUploaded();
                        break;
                    case "milestone":
                        currentProgress = userTrophy.getMilestonesReached();
                        break;
                }

                trophy.setCurrentProgress(currentProgress);

                if (currentProgress >= trophy.getRequiredProgress()) {
                    trophy.setEarned(true);
                    trophy.setEarnedDate(LocalDateTime.now().format(
                            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                }
            }
        }
    }

    public int getTotalEarnedTrophies() {
        UserTrophy userTrophy = getUserTrophies();
        return (int) userTrophy.getTrophies().stream()
                .filter(Trophy::isEarned)
                .count();
    }

    public List<Trophy> getEarnedTrophies() {
        UserTrophy userTrophy = getUserTrophies();
        return userTrophy.getTrophies().stream()
                .filter(Trophy::isEarned)
                .toList();
    }

    public List<Trophy> getUnearnedTrophies() {
        UserTrophy userTrophy = getUserTrophies();
        return userTrophy.getTrophies().stream()
                .filter(trophy -> !trophy.isEarned())
                .toList();
    }
}
