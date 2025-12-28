package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.Tracks;
import com.Muthu.EduPlus.Services.ProgressTrackerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pro")
public class ProgressTrackerController {

    @Autowired
    private ProgressTrackerService service;

    @GetMapping("/get-all-tracks")
    public List<Tracks> getAllTracks() {
        return service.getAllTrack();
    }

    @PostMapping("/create-track")
    public Tracks createTrack(@RequestBody String name) {
        return service.createTrack(name);
    }

    @DeleteMapping("/delete-track")
    public boolean deleteTrack(@RequestBody String name) {
        return service.deleteTrack(name);
    }

    @PostMapping("/change-username-forall")
    public void changeUsername(@RequestBody Map<String, String> data) {
        service.changeUsernameForAllTrack(
                data.get("oldUsername"),
                data.get("newUsername")
        );
    }

    @PostMapping("/change-track-name")
    public boolean changeTrackName(@RequestBody Map<String, String> data) {
        return service.changeTrackName(
                data.get("oldName"),
                data.get("newName")
        );
    }

    @PostMapping("/change-track-description")
    public boolean changeTrackDescription(@RequestBody Map<String, String> data) {
        return service.changeTrackDescription(
                data.get("trackName"),
                data.get("trackDescription")
        );
    }

    @PostMapping("/add-task")
    public Tracks addTask(@RequestBody Map<String, String> data) {
        return service.addTask(
                data.get("trackName"),
                data.get("taskName")
        );
    }

    @DeleteMapping("/delete-task")
    public boolean deleteTask(@RequestBody Map<String, String> data) {
        return service.deleteTask(
                data.get("trackName"),
                data.get("taskName")
        );
    }

    @PostMapping("/change-task-state")
    public boolean changeTaskStatus(@RequestBody Map<String, String> data) {
        return service.changeTaskStatus(
                data.get("trackName"),
                data.get("taskName")
        );
    }
}
