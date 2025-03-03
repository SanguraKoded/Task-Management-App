package com.sangura.task_management1.controllers;

import com.sangura.task_management1.dtos.AdminUserEditDTO;
import com.sangura.task_management1.dtos.UserRegistrationDTO;
import com.sangura.task_management1.entities.Task;
import com.sangura.task_management1.entities.User;
import com.sangura.task_management1.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v2")
public class AdminController {

    @Autowired
    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/admin/all")
    ResponseEntity<List<User>> getAllUsersAdmin(){
        return ResponseEntity.ok(userService.getAllUsers());
    }
    @GetMapping("/admin/user/{id}")
    ResponseEntity<User> getUserByIdAdmin(@PathVariable int id){
        return ResponseEntity.ok(userService.findUserById(id));
    }
    @PostMapping("/add-admin")
    ResponseEntity<User> addUserAdmin(@RequestBody UserRegistrationDTO userDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.addAdmin(userDto));
    }
    @PutMapping("/admin/update/{id}")
    ResponseEntity<User> updateUserAdmin(@RequestBody AdminUserEditDTO userDto, @PathVariable int id){
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.updateUserByIdAdmin(userDto,id));
    }

    @DeleteMapping("/admin/delete/{id}")
    ResponseEntity<String> deleteUserAdmin( @PathVariable int id){
        return ResponseEntity.ok(userService.deleteUserById(id));
    }
    @GetMapping("/admin/role/{role}")
    ResponseEntity<List<User>> getUsersByRoleAdmin(@PathVariable String role){
        return ResponseEntity.ok(userService.findUsersWithSameRole(role));
    }
    @GetMapping("/admin/tasks/{id}")
    ResponseEntity<List<Task>> getUserTasksAdmin(@PathVariable int id){
        return ResponseEntity.ok(userService.userTasksById(id));
    }
    @PutMapping("/admin/roles/change/{id}")
    ResponseEntity<User> changeUserRoleAdmin(@PathVariable int id){
        return ResponseEntity.ok(userService.changeUserRole(id));
    }
}
