package com.sangura.task_management1.services;

import com.sangura.task_management1.dtos.TaskDTO;
import com.sangura.task_management1.dtos.TaskListDTO;
import com.sangura.task_management1.dtos.TaskRegistrationDTO;
import com.sangura.task_management1.dtos.UserDTO;
import com.sangura.task_management1.entities.Task;
import com.sangura.task_management1.entities.User;
import com.sangura.task_management1.enums.TaskStatus;
import com.sangura.task_management1.exceptions.InvalidInputException;
import com.sangura.task_management1.exceptions.ResourceNotFoundException;
import com.sangura.task_management1.repo.TaskRepo;
import com.sangura.task_management1.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    public TaskService(TaskRepo taskRepo, UserRepo userRepo) {
        this.taskRepo = taskRepo;
        this.userRepo = userRepo;
    }
    @Autowired
    private final TaskRepo taskRepo;

    @Autowired
    private final UserRepo userRepo;

    public Task addTask(TaskRegistrationDTO taskDto){
        Task task = new Task();
        TaskDTO userTask = new TaskDTO();
        UserDTO userDto = new UserDTO();
       if(taskDto.getTitle()==null){
           throw new InvalidInputException("Task Title Cannot Be Null");
       }
       if(taskDto.getDescription()==null){
           throw new InvalidInputException("Task Description Cannot Be Null");
       }

       if(taskDto.getAssignedTo()==0){
           throw new InvalidInputException("Task Must Be Assigned");
       }
       int userId = taskDto.getAssignedTo();
       User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("Assigned to invalid userID"));

       task.setTitle(taskDto.getTitle());
       task.setDescription(taskDto.getDescription());
       task.setAssignedTo(user);
       user.getAssignedTasks().add(task);
       userTask.setTitle(task.getTitle());
       userTask.setDescription(task.getDescription());
       userTask.setId(task.getId());
       userDto.setId(user.getId());
       userDto.setUserName(user.getUserName());
       userDto.setEmail(user.getEmail());
       userDto.setPassword(user.getPassword());
       userDto.getAssignedTasks().add(userTask);

        return taskRepo.save(task);
    }
    public Task updateTask(TaskRegistrationDTO taskDto,int id){
        Task task = taskRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Given Task Id is Incorrect"));
        TaskDTO userTask = new TaskDTO();
        UserDTO userDto = new UserDTO();
        if(taskDto.getTitle()==null){
            throw new InvalidInputException("Task Title Cannot Be Null");
        }
        if(taskDto.getDescription()==null){
            throw new InvalidInputException("Task Description Cannot Be Null");
        }

        if(taskDto.getAssignedTo()==0){
            throw new InvalidInputException("Task Must Be Assigned");
        }
        int userId = taskDto.getAssignedTo();
        User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("Assigned to invalid userID"));
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setAssignedTo(user);
        user.getAssignedTasks().add(task);
        userTask.setTitle(task.getTitle());
        userTask.setDescription(task.getDescription());
        userTask.setId(task.getId());
        userDto.setId(user.getId());
        userDto.setUserName(user.getUserName());
        userDto.setEmail(user.getEmail());
        userDto.setPassword(user.getPassword());
        userDto.getAssignedTasks().add(userTask);
        return taskRepo.save(task);
    }

    public String deleteTask(int id){
        Task taskToDelete = taskRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Given Task Id is Incorrect"));
        taskRepo.deleteById(id);
        return ("Task "+ taskToDelete.getId()+" is Successfully Deleted");
    }


    public Task taskByTitle(String title){
        Task foundTask = taskRepo.findTaskByTitle(title);
        if(foundTask==null){
            throw new ResourceNotFoundException("No Task Found With The Given Title");
        }
        return foundTask;
    }

    public List<TaskDTO> tasksForEachEmployeeId(int id){
        User user = userRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Given User Id Is Incorrect"));

        return user.getAssignedTasks().stream().map(TaskDTO::new).collect(Collectors.toList());
    }

    public List<TaskListDTO> getAllTasks(){
        List<Task> taskList = taskRepo.findAll();
        List<TaskListDTO> listOfTasks = new ArrayList<>();

        if(taskList.isEmpty()){
            throw new ResourceNotFoundException("No Available Tasks Added");
        }
        for(Task task : taskList){
            TaskListDTO taskListDTO = new TaskListDTO();
            taskListDTO.setTitle(task.getTitle());
            taskListDTO.setDescription(task.getDescription());
            taskListDTO.setId(task.getId());
            taskListDTO.setAssignedTo(task.getAssignedTo().getId());
            listOfTasks.add(taskListDTO);
        }
        return listOfTasks;
    }
    public Task findTaskById(int id){
        return taskRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Given Task Id is Incorrect"));
    }
}
