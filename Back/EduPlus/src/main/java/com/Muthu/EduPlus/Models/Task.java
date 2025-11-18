package com.Muthu.EduPlus.Models;

public class Task {

    private String name;
    private boolean isCompleted;

    public Task(){}

    public Task(String name, boolean isCompleted) {
        this.name = name;
        this.isCompleted = isCompleted;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }

    @Override
    public String toString() {
        return "Task{" +
                "name='" + name + '\'' +
                ", isCompleted=" + isCompleted +
                '}';
    }
}
