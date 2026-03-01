package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.ProgressTrack;
import com.Muthu.EduPlus.Models.Task;
import com.Muthu.EduPlus.Repositories.ProgressTrackRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProgressTrackerService {

    @Autowired
    private ProgressTrackRepo repo;

    private String currentUser() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }

    // ─── DEFAULT TASKS ────────────────────────────────────────────────────────

    /**
     * Returns the standard "starter" task list shown to every new user
     * (or any user whose task list is empty) on their first login of the day.
     */
    private List<Task> defaultTasks() {
        List<Task> defaults = new ArrayList<>();
        defaults.add(new Task("Complete one test on a topic you're studying", false));
        defaults.add(new Task("Review yesterday's test results", false));
        defaults.add(new Task("Ask the AI assistant one study question", false));
        defaults.add(new Task("Upload a new study material or note", false));
        defaults.add(new Task("Check and respond to your friends' progress", false));
        return defaults;
    }

    // ─── CREATE / INIT ────────────────────────────────────────────────────────

    /**
     * Called when a brand-new user registers.
     * Pre-loads the default tasks immediately so the dashboard is never empty.
     */
    public ProgressTrack createTrack(String username) {
        if (repo.existsById(username)) {
            return repo.findById(username).orElseThrow();
        }
        return repo.save(new ProgressTrack(username, defaultTasks()));
    }

    /**
     * Ensures a user's task list is non-empty.
     * Called on first dashboard load each session.
     * If the list is empty (new user or cleared list), seeds the defaults.
     */
    public ProgressTrack ensureDefaultTasks() {
        String username = currentUser();
        ProgressTrack track = repo.findById(username).orElse(null);

        if (track == null) {
            // User has no track at all — create one with defaults
            return repo.save(new ProgressTrack(username, defaultTasks()));
        }

        if (track.getTasks() == null || track.getTasks().isEmpty()) {
            // Track exists but has no tasks — seed defaults
            track.setTasks(defaultTasks());
            return repo.save(track);
        }

        // All good, return as-is
        return track;
    }

    // ─── CRUD ─────────────────────────────────────────────────────────────────

    public ProgressTrack addTask(String taskName) {
        ProgressTrack currentTrack = repo.findUserByUsername(currentUser());
        List<Task> task = currentTrack.getTasks();
        task.add(new Task(taskName, false));
        currentTrack.setTasks(task);
        return repo.save(currentTrack);
    }

    public ProgressTrack removeTask(String taskName) {
        String username = currentUser();

        ProgressTrack progressTrack = repo.findById(username)
                .orElseThrow(() -> new RuntimeException("Progress track not found"));

        if (progressTrack.getTasks() == null) {
            return progressTrack;
        }

        progressTrack.getTasks().removeIf(
                task -> task.getName().equalsIgnoreCase(taskName));

        return repo.save(progressTrack);
    }

    public void toggleComplete(String taskName) {
        String username = currentUser();

        ProgressTrack progressTrack = repo.findById(username)
                .orElseThrow(() -> new RuntimeException("Progress track not found"));

        if (progressTrack.getTasks() == null) {
            return;
        }

        for (Task task : progressTrack.getTasks()) {
            if (task.getName().equalsIgnoreCase(taskName)) {
                task.setCompleted(!task.isCompleted());
                break;
            }
        }
        repo.save(progressTrack);
    }

    public void deleteTrack(String username) {
        repo.deleteById(username);
    }

    public void changeUsernameTrack(String currentUsername, String newUsername) {
        ProgressTrack oldTrack = repo.findById(currentUsername).orElse(null);

        if (oldTrack == null) {
            return;
        }

        ProgressTrack newTrack = new ProgressTrack();
        newTrack.setUsername(newUsername);
        newTrack.setTasks(oldTrack.getTasks());

        repo.save(newTrack);
        repo.deleteById(currentUsername);
    }

    public ProgressTrack getTrack() {
        return repo.findUserByUsername(currentUser());
    }
}
