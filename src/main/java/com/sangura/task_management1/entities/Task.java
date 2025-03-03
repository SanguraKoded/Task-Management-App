package com.sangura.task_management1.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.sangura.task_management1.enums.TaskStatus;
import jakarta.persistence.*;



@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    private String description;


    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    private User assignedTo;

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }


    public User getAssignedTo() {
        return assignedTo;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public void setAssignedTo(User assignedTo) {
        this.assignedTo = assignedTo;
    }

    public Task(int id, String title, String description, TaskStatus status, User assignedTo) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.assignedTo = assignedTo;
    }

    @Override
    public String toString() {
        return "Task{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", assignedTo=" + assignedTo +
                '}';
    }

    public Task(){

    }
}


