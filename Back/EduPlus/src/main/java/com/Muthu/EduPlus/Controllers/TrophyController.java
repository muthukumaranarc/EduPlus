package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.Trophy;
import com.Muthu.EduPlus.Models.UserTrophy;
import com.Muthu.EduPlus.Services.TrophyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/trophy")
public class TrophyController {

    private final TrophyService trophyService;

    public TrophyController(TrophyService trophyService) {
        this.trophyService = trophyService;
    }

    @GetMapping("/get-user-trophies")
    public UserTrophy getUserTrophies() {
        return trophyService.getUserTrophies();
    }

    @PostMapping("/get-user-trophies-by-username")
    public UserTrophy getUserTrophiesByUsername(@RequestBody String username) {
        return trophyService.getUserTrophiesByUsername(username);
    }

    @GetMapping("/get-earned-trophies")
    public List<Trophy> getEarnedTrophies() {
        return trophyService.getEarnedTrophies();
    }

    @GetMapping("/get-unearned-trophies")
    public List<Trophy> getUnearnedTrophies() {
        return trophyService.getUnearnedTrophies();
    }

    @GetMapping("/get-total-earned")
    public int getTotalEarnedTrophies() {
        return trophyService.getTotalEarnedTrophies();
    }

    @PostMapping("/increment-test-completed")
    public void incrementTestCompleted() {
        trophyService.incrementTestCompleted();
    }

    @PostMapping("/record-high-score")
    public void recordHighScore() {
        trophyService.recordHighScore();
    }

    @PostMapping("/update-streak")
    public void updateStreak(@RequestBody Map<String, Integer> data) {
        trophyService.updateStreak(data.get("streak"));
    }

    @PostMapping("/increment-material-uploaded")
    public void incrementMaterialUploaded() {
        trophyService.incrementMaterialUploaded();
    }

    @PostMapping("/increment-milestone")
    public void incrementMilestone() {
        trophyService.incrementMilestone();
    }
}
