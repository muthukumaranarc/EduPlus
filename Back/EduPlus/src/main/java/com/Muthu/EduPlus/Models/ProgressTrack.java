package com.Muthu.EduPlus.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "progress-track")
public class ProgressTrack {

    @Id
    private String username;
    private List<Tracks> tracks;

    public ProgressTrack() {}

    public ProgressTrack(String username, List<Tracks> tracks) {
        this.username = username;
        this.tracks = tracks;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<Tracks> getTracks() {
        return tracks;
    }

    public void setTracks(List<Tracks> tracks) {
        this.tracks = tracks;
    }

    @Override
    public String toString() {
        return "ProgressTrack{" +
                "username='" + username + '\'' +
                ", tracks=" + tracks +
                '}';
    }
}
