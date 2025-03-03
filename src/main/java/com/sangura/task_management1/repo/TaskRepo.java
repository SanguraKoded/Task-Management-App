package com.sangura.task_management1.repo;

import com.sangura.task_management1.entities.Task;
import com.sangura.task_management1.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepo extends JpaRepository<Task, Integer> {
    Task findTaskByTitle(String title);
}
