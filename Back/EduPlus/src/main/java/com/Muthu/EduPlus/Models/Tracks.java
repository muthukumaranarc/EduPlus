package com.Muthu.EduPlus.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "Tracks")
public class Tracks {

    @Id
    private int id;
    private String username;
    private String trackName;
    private String trackDescription;
    private List<Task> task;

    public Tracks() {}

    public Tracks(int id, String username, String trackName, String trackDescription, List<Task> task) {
        this.id = id;
        this.username = username;
        this.trackName = trackName;
        this.trackDescription = trackDescription;
        this.task = task;
    }

    public int getId(){
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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
                "username='" + username + '\'' +
                ", trackName='" + trackName + '\'' +
                ", trackDescription='" + trackDescription + '\'' +
                ", task=" + task +
                '}';
    }
}
