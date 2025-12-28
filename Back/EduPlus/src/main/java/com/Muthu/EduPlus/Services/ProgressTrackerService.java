package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.ProgressTrack;
import com.Muthu.EduPlus.Models.Task;
import com.Muthu.EduPlus.Models.Tracks;
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

    private ProgressTrack getOrCreateUserTrack(String username) {
        return repo.findById(username)
                .orElseGet(() -> {
                    ProgressTrack pt = new ProgressTrack();
                    pt.setUsername(username);
                    pt.setTracks(new ArrayList<>());
                    return pt;
                });
    }

    public void deleteUser(String username) {
        repo.deleteById(username);
    }

    public List<Tracks> getAllTrack() {
        return repo.findById(currentUser())
                .map(ProgressTrack::getTracks)
                .orElse(new ArrayList<>());
    }

    public Tracks createTrack(String name) {
        ProgressTrack pt = getOrCreateUserTrack(currentUser());

        boolean exists = pt.getTracks().stream()
                .anyMatch(t -> t.getTrackName().equals(name));

        if (exists) return null;

        Tracks track = new Tracks(name, "", new ArrayList<>());
        pt.getTracks().add(track);
        repo.save(pt);

        return track;
    }

    public Tracks createTrack(String username, String name, String description) {
        ProgressTrack pt = getOrCreateUserTrack(username);

        boolean exists = pt.getTracks().stream()
                .anyMatch(t -> t.getTrackName().equals(name));

        if (exists) return null;

        Tracks track = new Tracks(name, description, new ArrayList<>());
        pt.getTracks().add(track);
        repo.save(pt);

        return track;
    }

    public boolean deleteTrack(String trackName) {
        ProgressTrack pt = repo.findById(currentUser()).orElse(null);
        if (pt == null) return false;

        boolean removed = pt.getTracks()
                .removeIf(t -> t.getTrackName().equals(trackName));

        if (!removed) return false;

        repo.save(pt);
        return true;
    }

    public boolean changeTrackName(String oldName, String newName) {
        ProgressTrack pt = repo.findById(currentUser()).orElse(null);
        if (pt == null) return false;

        for (Tracks t : pt.getTracks()) {
            if (t.getTrackName().equals(oldName)) {
                t.setTrackName(newName);
                repo.save(pt);
                return true;
            }
        }
        return false;
    }

    public boolean changeTrackDescription(String trackName, String description) {
        ProgressTrack pt = repo.findById(currentUser()).orElse(null);
        if (pt == null) return false;

        for (Tracks t : pt.getTracks()) {
            if (t.getTrackName().equals(trackName)) {
                t.setTrackDescription(description);
                repo.save(pt);
                return true;
            }
        }
        return false;
    }

    public Tracks addTask(String trackName, String taskName) {
        ProgressTrack pt = repo.findById(currentUser()).orElse(null);
        if (pt == null) return null;

        for (Tracks t : pt.getTracks()) {
            if (t.getTrackName().equals(trackName)) {
                t.getTask().add(new Task(taskName, false));
                repo.save(pt);
                return t;
            }
        }
        return null;
    }

    public boolean deleteTask(String trackName, String taskName) {
        ProgressTrack pt = repo.findById(currentUser()).orElse(null);
        if (pt == null) return false;

        for (Tracks t : pt.getTracks()) {
            if (t.getTrackName().equals(trackName)) {
                boolean removed = t.getTask()
                        .removeIf(task -> task.getName().equals(taskName));

                if (!removed) return false;

                repo.save(pt);
                return true;
            }
        }
        return false;
    }

    public boolean changeTaskStatus(String trackName, String taskName) {
        ProgressTrack pt = repo.findById(currentUser()).orElse(null);
        if (pt == null) return false;

        for (Tracks t : pt.getTracks()) {
            if (t.getTrackName().equals(trackName)) {
                for (Task task : t.getTask()) {
                    if (task.getName().equals(taskName)) {
                        task.setCompleted(!task.isCompleted());
                        repo.save(pt);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public void changeUsernameForAllTrack(String oldUsername, String newUsername) {
        ProgressTrack pt = repo.findById(oldUsername).orElse(null);
        if (pt == null) return;

        repo.deleteById(oldUsername);
        pt.setUsername(newUsername);
        repo.save(pt);
    }
}
