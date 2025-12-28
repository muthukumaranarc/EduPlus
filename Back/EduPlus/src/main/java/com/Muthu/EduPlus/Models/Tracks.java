package com.Muthu.EduPlus.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

public class Tracks {

    private String trackName;
    private String trackDescription;
    private List<Task> task;

    public Tracks() {}

    public Tracks(String trackName, String trackDescription, List<Task> task) {
        this.trackName = trackName;
        this.trackDescription = trackDescription;
        this.task = task;
    }

    public String getTrackName() {
        return trackName;
    }

    public void setTrackName(String tractName) {
        this.trackName = tractName;
    }

    public String getTrackDescription() {
        return trackDescription;
    }

    public void setTrackDescription(String trackDescription) {
        this.trackDescription = trackDescription;
    }

    public List<Task> getTask() {
        return task;
    }

    public void setTask(List<Task> task) {
        this.task = task;
    }

    @Override
    public String toString() {
        return "Tracks{" +
                "trackName='" + trackName + '\'' +
                ", trackDescription='" + trackDescription + '\'' +
                ", task=" + task +
                '}';
    }
}
