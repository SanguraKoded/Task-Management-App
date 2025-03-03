package com.sangura.task_management1.dtos;

import com.sangura.task_management1.entities.User;
import com.sangura.task_management1.enums.Roles;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

public class UserDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    private String userName;

    private String email;

    private String password;


    private List<TaskDTO> assignedTasks = new ArrayList<>();



    public UserDTO(User user) {
        this.id = user.getId();
        this.userName = user.getUserName();
        this.email = user.getEmail();
        this.password = user.getEmail();
        this.assignedTasks = assignedTasks;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public List<TaskDTO> getAssignedTasks() {
        return assignedTasks;
    }

    public void setAssignedTasks(List<TaskDTO> assignedTasks) {
        this.assignedTasks = assignedTasks;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", userName='" + userName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", assignedTasks=" + assignedTasks +
                '}';
    }

    public UserDTO(){

    }
}
