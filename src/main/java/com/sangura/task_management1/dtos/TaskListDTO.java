package com.sangura.task_management1.dtos;

import com.sangura.task_management1.entities.User;
import com.sangura.task_management1.enums.TaskStatus;
import jakarta.persistence.*;

public class TaskListDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    private String description;

    private int assignedTo;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(int assignedTo) {
        this.assignedTo = assignedTo;
    }

    @Override
    public String toString() {
        return "TaskListDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", assignedTo=" + assignedTo +
                '}';
    }

    public TaskListDTO(int id, String title, String description, int assignedTo) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.assignedTo = assignedTo;
    }

    public TaskListDTO(){

    }
}
