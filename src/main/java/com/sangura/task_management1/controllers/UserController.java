package com.sangura.task_management1.controllers;

import com.sangura.task_management1.dtos.UserRegistrationDTO;
import com.sangura.task_management1.entities.Task;
import com.sangura.task_management1.entities.User;
import com.sangura.task_management1.entities.UserPrincipal;
import com.sangura.task_management1.repo.UserRepo;
import com.sangura.task_management1.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private final UserService userService;

    @Autowired
    private final UserRepo userRepo;

    public UserController(UserService userService, UserRepo userRepo) {
        this.userService = userService;
        this.userRepo = userRepo;
    }


    @GetMapping("/profile")
    ResponseEntity<User> getUserProfile(Authentication authentication){
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String userName = userPrincipal.getUsername();
        User userProfile = userRepo.findUserByUserName(userName);
        return ResponseEntity.ok(userProfile);
    }
    @PostMapping("/add")
    ResponseEntity<User> addUser(@RequestBody UserRegistrationDTO userDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.addUser(userDto));
    }
    @PutMapping("/update/{id}")
    ResponseEntity<User> updateUser(@RequestBody UserRegistrationDTO userDto, @PathVariable int id){
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.updateUserById(userDto,id));
    }
    @GetMapping("/tasks/username/{userName}")
    ResponseEntity<List<Task>> usersTasks(@PathVariable String userName){
        return ResponseEntity.ok(userService.findTasksForUser(userName));
    }

    @DeleteMapping("/delete/{id}")
    ResponseEntity<String> deleteUser(@PathVariable int id){
        return ResponseEntity.ok(userService.deleteUserById(id));
    }

    @GetMapping("/tasks/{id}")
    ResponseEntity<List<Task>> getUserTasks(@PathVariable int id){
        return ResponseEntity.ok(userService.userTasksById(id));
    }

    @PostMapping("/login")
    String login(@RequestBody User user){
        return userService.verify(user);
    }
}
