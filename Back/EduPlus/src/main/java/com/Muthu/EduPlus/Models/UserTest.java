package com.Muthu.EduPlus.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "test")
public class UserTest {

    @Id
    private String username;
    private List<TestGroup> testGroup;

    private UserTest() {}

    public UserTest(String username, List<TestGroup> testGroup) {
        this.username = username;
        this.testGroup = testGroup;
    }

    public List<TestGroup> getTestGroup() {
        return testGroup;
    }

    public void setTestGroup(List<TestGroup> testGroup) {
        this.testGroup = testGroup;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
