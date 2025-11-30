package com.Muthu.EduPlus.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Arrays;

@Document(collection = "friends")
public class Friends {

    @Id
    private String username;
    private String[] friends;

    public Friends() {}

    public Friends(String username, String[] friends) {
        this.username = username;
        this.friends = friends;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String[] getFriends() {
        return friends;
    }

    public void setFriends(String[] friends) {
        this.friends = friends;
    }

    @Override
    public String toString() {
        return "Friends{" +
                "username='" + username + '\'' +
                ", friends=" + Arrays.toString(friends) +
                '}';
    }
}
