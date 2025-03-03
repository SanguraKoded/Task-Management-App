package com.sangura.task_management1.controllers;

import com.sangura.task_management1.dtos.TaskDTO;
import com.sangura.task_management1.dtos.TaskListDTO;
import com.sangura.task_management1.dtos.TaskRegistrationDTO;
import com.sangura.task_management1.entities.Task;
import com.sangura.task_management1.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/tasks")
public class TaskController {
    @Autowired
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("")
    ResponseEntity<List<TaskListDTO>> getAllTasks(){
        return ResponseEntity.ok(taskService.getAllTasks());
    }
    @GetMapping("/{id}")
    ResponseEntity<Task> getTaskById(@PathVariable int id){
        return ResponseEntity.ok(taskService.findTaskById(id));
    }
    @PostMapping("/add")
    ResponseEntity<Task> addTask(@RequestBody TaskRegistrationDTO taskDto){
        return ResponseEntity.ok(taskService.addTask(taskDto));
    }
    @PutMapping("/{id}")
    ResponseEntity<Task> updateTask(@RequestBody TaskRegistrationDTO taskDto, @PathVariable int id){
        return ResponseEntity.ok(taskService.updateTask(taskDto, id));
    }
    @DeleteMapping("/delete/{id}")
    ResponseEntity<String> deleteTaskById(@PathVariable int id){
        return ResponseEntity.ok(taskService.deleteTask(id));
    }
    @GetMapping("/title/{taskTitle}")
    ResponseEntity<Task> findTaskByTitle(@PathVariable String taskTitle){
        return ResponseEntity.ok(taskService.taskByTitle(taskTitle));
    }
    @GetMapping("/user/{id}")
    ResponseEntity<List<TaskDTO>> findTaskForEmployee(@PathVariable int id){
        return ResponseEntity.ok(taskService.tasksForEachEmployeeId(id));
    }
}
