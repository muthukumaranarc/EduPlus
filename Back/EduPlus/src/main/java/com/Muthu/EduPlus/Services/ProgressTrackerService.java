package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.Task;
import com.Muthu.EduPlus.Models.Tracks;
import com.Muthu.EduPlus.Repositories.TracksRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgressTrackerService {

    @Autowired
    private TracksRepo tracksRepo;

    public List<Tracks> getAllTrack() {
        return tracksRepo.findAllByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName()
        );
    }

    public Tracks createTrack(String name){
        for(Tracks track : getAllTrack()) if(track.getTrackName().equals(name)) return null;
        Tracks newTrack = new Tracks();
        newTrack.setUsername(
                SecurityContextHolder.getContext().getAuthentication().getName()
        );
        return tracksRepo.save(newTrack);
    }

    public Tracks createTrack(String username, String name){
        for(Tracks track : getAllTrack()) if(track.getTrackName().equals(name)) return null;
        Tracks newTrack = new Tracks();
        newTrack.setUsername(username);
        return tracksRepo.save(newTrack);
    }

    public boolean deleteTrack(String trackName){
        for(Tracks track : getAllTrack())
            if(track.getTrackName().equals(trackName)){
                tracksRepo.delete(track);
                return true;
            }
        return false;
    }


    // for this need a action in the UserService
    public void changeUsernameForAllTrack(String oldUsername, String newUsername) {
        for(Tracks track : tracksRepo.findAllByUsername(oldUsername))
            if(track.getUsername().equals(oldUsername)){
                track.setUsername(newUsername);
                tracksRepo.save(track);
            }
    }

    public boolean changeTrackName(String oldName, String newName){
        for(Tracks track : getAllTrack())
            if(track.getTrackName().equals(oldName)){
                track.setTrackName(newName);
                tracksRepo.save(track);
                return true;
            }
        return false;
    }

    public boolean changeTrackDescription(String trackName, String trackDescription) {
        for(Tracks track : getAllTrack())
            if(track.getTrackName().equals(trackName)){
                track.setTrackDescription(trackDescription);
                tracksRepo.save(track);
                return true;
            }
        return false;
    }

    public Tracks addTask(String trackName, String taskName){
        for(Tracks track : getAllTrack())
            if(track.getTrackName().equals(trackName)){
                List<Task> tasks = track.getTask();
                tasks.add(new Task(taskName, false));
                track.setTask(tasks);
                tracksRepo.save(track);
                return track;
            }
        return null;
    }

    public boolean deleteTask(String trackName, String taskName) {
        for (Tracks track : getAllTrack()) {
            if (track.getTrackName().equals(trackName)) {
                List<Task> tasks = track.getTask();
                boolean removed = tasks.removeIf(task -> task.getName().equals(taskName));
                if (!removed) return false;
                tracksRepo.save(track);
                return true;
            }
        }
        return false;
    }


    public boolean changeTaskStatus(String trackName, String taskName) {
        for (Tracks track : getAllTrack()) {
            if (track.getTrackName().equals(trackName)) {
                List<Task> tasks = track.getTask();
                for (Task task : tasks) {
                    if (task.getName().equals(taskName)) {
                        task.setCompleted(!task.isCompleted());
                        tracksRepo.save(track);
                        return true;
                    }
                }
            }
        }
        return false;
    }

}
