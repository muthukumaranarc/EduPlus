package com.Muthu.EduPlus.Models;

import java.util.List;

public class TestGroup {
    private String name;
    private List<Test> group;

    private TestGroup() {}

    public TestGroup(List<Test> group, String name) {
        this.group = group;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Test> getGroup() {
        return group;
    }

    public void setGroup(List<Test> group) {
        this.group = group;
    }
}
