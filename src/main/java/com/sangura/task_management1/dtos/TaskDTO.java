package com.sangura.task_management1.dtos;

import com.sangura.task_management1.entities.Task;

public class TaskDTO {
    private int id;
    private String title;
    private String description;

    // Constructor that initializes TaskDTO from a Task entity
    public TaskDTO(Task task) {
        if (task != null) { // Avoid NullPointerException
            this.id = task.getId();
            this.title = task.getTitle();
            this.description = task.getDescription();
        }
    }

    // Standard constructor
    public TaskDTO(int id, String title, String description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }

    // No-argument constructor
    public TaskDTO() {
    }

    // Getters and Setters
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

    @Override
    public String toString() {
        return "TaskDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
