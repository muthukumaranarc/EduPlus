package com.Muthu.EduPlus.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "friends")
public class Friends {

    @Id
    private String username;

    private List<String> friends = new ArrayList<>();

    public Friends() {}

    public Friends(String username) {
        this.username = username;
        this.friends = new ArrayList<>();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getFriends() {
        return friends;
    }

    public void addFriend(String friendId) {
        if (!friends.contains(friendId)) {
            friends.add(friendId);
        }
    }

    public void removeFriend(String friendId) {
        friends.remove(friendId);
    }
}
