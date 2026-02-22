package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.Trophy;
import com.Muthu.EduPlus.Models.User;
import com.Muthu.EduPlus.Models.UserTrophy;
import com.Muthu.EduPlus.Repositories.TrophyRepo;
import com.Muthu.EduPlus.Repositories.UserRepo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.DayOfWeek;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class TrophyService {

    private final TrophyRepo trophyRepo;
    private final UserRepo userRepo;

    public TrophyService(TrophyRepo trophyRepo, UserRepo userRepo) {
        this.trophyRepo = trophyRepo;
        this.userRepo = userRepo;
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    // ─── GET USER TROPHIES ────────────────────────────────────────────────────

    public UserTrophy getUserTrophies() {
        String username = getCurrentUsername();
        UserTrophy userTrophy = trophyRepo.findByUsername(username);

        if (userTrophy == null) {
            userTrophy = new UserTrophy(username);
            trophyRepo.save(userTrophy);
        }

        checkAndResetIfNewWeek(userTrophy);

        // Sync progress on every load so roadmap bars always show real values
        checkAndAwardTrophies(userTrophy);
        trophyRepo.save(userTrophy);

        return userTrophy;
    }

    public UserTrophy getUserTrophiesByUsername(String username) {
        UserTrophy userTrophy = trophyRepo.findByUsername(username);

        if (userTrophy == null) {
            userTrophy = new UserTrophy(username);
            trophyRepo.save(userTrophy);
        }

        checkAndResetIfNewWeek(userTrophy);

        // Sync progress on every load so roadmap bars always show real values
        checkAndAwardTrophies(userTrophy);
        trophyRepo.save(userTrophy);

        return userTrophy;
    }

    // ─── WEEKLY RESET ─────────────────────────────────────────────────────────

    /**
     * Called on every trophy fetch. If the calendar has moved past the Monday
     * that started the stored week, the trophy list is re-seeded from scratch
     * and all weekly stat counters are zeroed out.
     *
     * currentStreak is intentionally NOT reset — it is a global consecutive-day
     * streak managed elsewhere and must survive week boundaries.
     */
    private void checkAndResetIfNewWeek(UserTrophy userTrophy) {
        // Current week's Monday in yyyy-MM-dd
        LocalDate today = LocalDate.now();
        LocalDate currentMonday = today.with(DayOfWeek.MONDAY);
        String currentWeekKey = currentMonday.toString();

        String stored = userTrophy.getWeekStartDate();
        if (stored != null && stored.equals(currentWeekKey)) {
            return; // still the same week — nothing to do
        }

        // ── New week: reset everything ──
        userTrophy.setWeekStartDate(currentWeekKey);

        // Re-seed the full 50-trophy list (all unearned, all progress 0)
        UserTrophy fresh = new UserTrophy(userTrophy.getUsername());
        userTrophy.setTrophies(fresh.getTrophies());

        // Reset weekly counters (streak is preserved)
        userTrophy.setTestsCompleted(0);
        userTrophy.setHighScoreCount(0);
        userTrophy.setMaterialsUploaded(0);
        userTrophy.setMilestonesReached(0);
        userTrophy.setTotalEarned(0);

        trophyRepo.save(userTrophy);
        syncTrophyCountToUser(userTrophy);
    }

    // ─── AWARD ACTIONS ────────────────────────────────────────────────────────

    public void incrementTestCompleted() {
        UserTrophy userTrophy = getUserTrophies();
        userTrophy.setTestsCompleted(userTrophy.getTestsCompleted() + 1);
        checkAndAwardTrophies(userTrophy);
        trophyRepo.save(userTrophy);
        syncTrophyCountToUser(userTrophy);
    }

    public void recordHighScore() {
        UserTrophy userTrophy = getUserTrophies();
        userTrophy.setHighScoreCount(userTrophy.getHighScoreCount() + 1);
        checkAndAwardTrophies(userTrophy);
        trophyRepo.save(userTrophy);
        syncTrophyCountToUser(userTrophy);
    }

    public void updateStreak(int streak) {
        UserTrophy userTrophy = getUserTrophies();
        userTrophy.setCurrentStreak(streak);
        checkAndAwardTrophies(userTrophy);
        trophyRepo.save(userTrophy);
        syncTrophyCountToUser(userTrophy);
    }

    public void incrementMaterialUploaded() {
        UserTrophy userTrophy = getUserTrophies();
        userTrophy.setMaterialsUploaded(userTrophy.getMaterialsUploaded() + 1);
        checkAndAwardTrophies(userTrophy);
        trophyRepo.save(userTrophy);
        syncTrophyCountToUser(userTrophy);
    }

    public void incrementMilestone() {
        UserTrophy userTrophy = getUserTrophies();
        userTrophy.setMilestonesReached(userTrophy.getMilestonesReached() + 1);
        checkAndAwardTrophies(userTrophy);
        trophyRepo.save(userTrophy);
        syncTrophyCountToUser(userTrophy);
    }

    // ─── CORE TROPHY LOGIC ───────────────────────────────────────────────────

    /**
     * Updates progress for every trophy and awards any newly unlocked ones.
     * Progress is always updated, even for already earned trophies (so the UI
     * shows the real numbers).
     */
    private void checkAndAwardTrophies(UserTrophy userTrophy) {
        List<Trophy> trophies = userTrophy.getTrophies();
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        for (Trophy trophy : trophies) {
            int currentProgress = resolveProgress(trophy.getCategory(), userTrophy);
            trophy.setCurrentProgress(currentProgress);

            // Award if threshold is met and not already earned
            if (!trophy.isEarned() && currentProgress >= trophy.getRequiredProgress()) {
                trophy.setEarned(true);
                trophy.setEarnedDate(now);
            }
        }

        // Recalculate and store total earned count
        int earned = (int) trophies.stream().filter(Trophy::isEarned).count();
        userTrophy.setTotalEarned(earned);
    }

    /** Maps a category name to the relevant stat value on the UserTrophy record. */
    private int resolveProgress(String category, UserTrophy ut) {
        return switch (category) {
            case "test" -> ut.getTestsCompleted();
            case "score" -> ut.getHighScoreCount();
            case "consistency" -> ut.getCurrentStreak();
            case "contribution" -> ut.getMaterialsUploaded();
            case "milestone" -> ut.getMilestonesReached();
            default -> 0;
        };
    }

    /**
     * Keeps the lightweight User.trophy field in sync so the friends leaderboard
     * (which uses User documents) always reflects the real earned count.
     */
    private void syncTrophyCountToUser(UserTrophy userTrophy) {
        String username = userTrophy.getUsername();
        User user = userRepo.findByUsername(username);
        if (user != null) {
            user.setTrophy(userTrophy.getTotalEarned());
            userRepo.save(user);
        }
    }

    // ─── READ HELPERS ────────────────────────────────────────────────────────

    public int getTotalEarnedTrophies() {
        return getUserTrophies().getTotalEarned();
    }

    public List<Trophy> getEarnedTrophies() {
        return getUserTrophies().getTrophies().stream()
                .filter(Trophy::isEarned)
                .toList();
    }

    public List<Trophy> getUnearnedTrophies() {
        return getUserTrophies().getTrophies().stream()
                .filter(t -> !t.isEarned())
                .toList();
    }
}
