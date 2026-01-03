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

    public ProgressTrack createTrack(String username) {
        return repo.save(
                new ProgressTrack(username, new ArrayList<Task>())
        );
    }

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
                task -> task.getName().equalsIgnoreCase(taskName)
        );

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
