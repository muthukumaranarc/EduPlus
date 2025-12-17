package com.Muthu.EduPlus.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Arrays;
import java.util.List;

@Document(collection = "friends")
public class Friends {

    @Id
    private String username;
    private List<String> friends;

    public Friends() {}

    public Friends(String username, List<String> friends) {
        this.username = username;
        this.friends = friends;
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

    public void setFriends(List<String> friends) {
        this.friends = friends;
    }

    @Override
    public String toString() {
        return "Friends{" +
                "username='" + username + '\'' +
                ", friends=" + friends +
                '}';
    }
}
