package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.ProgressTrack;
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

    @PostMapping("/create")
    public ProgressTrack create(@RequestBody String username) {
        return service.createTrack(username);
    }

    @GetMapping("/get")
    public ProgressTrack getTrack() {
        return service.getTrack();
    }

    @PostMapping("/add")
    public ProgressTrack addTask(@RequestBody String taskName) {
        return service.addTask(taskName);
    }

    @DeleteMapping("/remove")
    public ProgressTrack removeTask(@RequestBody String taskName) {
        return service.removeTask(taskName);
    }

    @PostMapping("/toggle")
    public void toggleComplete(@RequestBody String taskName) {
        service.toggleComplete(taskName);
    }

    @DeleteMapping("/delete")
    public void deleteTrack(@RequestBody String username) {
        service.deleteTrack(username);
    }

    @PostMapping("/change-username")
    public void changeUsernameTrack(@RequestBody Map<String, String> data) {
        service.changeUsernameTrack(
                data.get("currentUsername"),
                data.get("newUsername")
        );
    }
}
