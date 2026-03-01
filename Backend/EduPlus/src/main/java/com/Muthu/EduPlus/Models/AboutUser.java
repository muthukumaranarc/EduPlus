package com.Muthu.EduPlus.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "about_users")
public class AboutUser {

    @Id
    private String id;

    private String username;
    private List<String> data = new ArrayList<>();

    public AboutUser() {}

    public AboutUser(String username, List<String> data) {
        this.username = username;
        this.data = data;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getData() {
        return data;
    }

    public void setData(List<String> data) {
        this.data = data;
    }
}
