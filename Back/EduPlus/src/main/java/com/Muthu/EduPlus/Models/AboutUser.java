package com.Muthu.EduPlus.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "AboutUser")
public class AboutUser {

    @Id
    private String username;
    private List<String> data;

    public AboutUser(){}

    public AboutUser(String username, List<String> data) {
        this.username = username;
        this.data = data;
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

    @Override
    public String toString() {
        return "AboutUser{" +
                "username='" + username + '\'' +
                ", data=" + data +
                '}';
    }
}
