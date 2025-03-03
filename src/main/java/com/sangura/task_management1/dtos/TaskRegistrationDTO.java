package com.sangura.task_management1.dtos;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sangura.task_management1.entities.User;
import com.sangura.task_management1.enums.TaskStatus;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class TaskRegistrationDTO {

    private String title;

    private String description;



    private int assignedTo;

    @JsonCreator
    public TaskRegistrationDTO(
            @JsonProperty("title") String title,
            @JsonProperty("description") String description,
            @JsonProperty("assignedTo") int assignedTo) {
        this.title = title;
        this.description = description;
        this.assignedTo = assignedTo;
    }

    public TaskRegistrationDTO(String title, String description, TaskStatus status, int assignedTo) {
        this.title = title;
        this.description = description;
        this.assignedTo = assignedTo;
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
        return "TaskRegistrationDTO{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", assignedTo=" + assignedTo +
                '}';
    }

    public TaskRegistrationDTO(){

    }
}
