package com.sangura.task_management1.services;

import com.sangura.task_management1.dtos.AdminUserEditDTO;
import com.sangura.task_management1.dtos.TaskDTO;
import com.sangura.task_management1.dtos.UserDTO;
import com.sangura.task_management1.dtos.UserRegistrationDTO;
import com.sangura.task_management1.entities.Task;
import com.sangura.task_management1.entities.User;
import com.sangura.task_management1.enums.Roles;
import com.sangura.task_management1.exceptions.InvalidInputException;
import com.sangura.task_management1.exceptions.ResourceNotFoundException;
import com.sangura.task_management1.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }
    @Autowired
    private final UserRepo userRepo;

    @Autowired
    AuthenticationManager authManager;


    @Autowired
    JWTService jwtService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public User addUser(UserRegistrationDTO userDto){
        User user = new User();
        if(userDto.getUserName()==null|| userDto.getUserName().trim().isEmpty()){
            throw new InvalidInputException("UserName Cannot Be Null");
        }
        if(userRepo.existsByUserName(userDto.getUserName())){
            throw new InvalidInputException("UserName Already Exists!");
        }
        if(!userDto.getEmail().endsWith("@gmail.com")){
            if (!userDto.getEmail().endsWith("@outlook.com")
            ) {
                if (!userDto.getEmail().endsWith("@yahoo.com")){
                    throw new InvalidInputException("Please enter valid email.");
                }
            }
        }
        if(userDto.getPassword()==null||userDto.getPassword().trim().isEmpty()){
            throw new InvalidInputException("Password Cannot Be Null");
        }
        user.setUserName(userDto.getUserName());
        user.setEmail(userDto.getEmail());
        user.setPassword(encoder.encode(userDto.getPassword()));
        user.setRole(Roles.USER);
        return userRepo.save(user);
    }
    public User updateUserById(UserRegistrationDTO userDto, int id){
        User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Given Id Is Incorrect"));

        if(userDto.getUserName()==null){
            throw new InvalidInputException("UserName Cannot Be Null");
        }
        if(userDto.getEmail().endsWith("@gmail.com")){
            if (userDto.getEmail().endsWith("@outlook.com")
            ) {
                if (userDto.getEmail().endsWith("@yahoo.com")){
                    throw new InvalidInputException("Please enter valid email.");
                }
            }
        }
        if(userDto.getPassword()==null){
            throw new InvalidInputException("Password Cannot Be Null");
        }


        user.setUserName(userDto.getUserName());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setRole(Roles.USER);
        return userRepo.save(user);

    }

    public User updateUserByIdAdmin(AdminUserEditDTO userDto, int id){
        User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Given Id Is Incorrect"));

        if(userDto.getUserName()==null){
            throw new InvalidInputException("UserName Cannot Be Null");
        }
        if(userDto.getEmail().endsWith("@gmail.com")){
            if (userDto.getEmail().endsWith("@outlook.com")
            ) {
                if (userDto.getEmail().endsWith("@yahoo.com")){
                    throw new InvalidInputException("Please enter valid email.");
                }
            }
        }

        user.setUserName(userDto.getUserName());
        user.setEmail(userDto.getEmail());
        user.setRole(Roles.USER);
        return userRepo.save(user);

    }

    public String deleteUserById(int id){
        User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Given Id Is Incorrect"));
        userRepo.deleteById(id);
        return ("User "+user.getId()+" is Successfully Deleted");
    }

    public List<User> getAllUsers(){
        if(userRepo.findAll().isEmpty()){
            throw new ResourceNotFoundException("No User Added Yet");
        }
        return userRepo.findAll();
    }

    public List<Task> findTasksForUser(String userName){
        User user = userRepo.findUserByUserName(userName);
        if(user==null){
            throw new ResourceNotFoundException("No User Found With The Given UserName");
        }
        return user.getAssignedTasks();
    }
    public User findUserByUserName(String userName){
        User foundUser = userRepo.findUserByUserName(userName);
        if(foundUser==null){
            throw new ResourceNotFoundException("No User Found With The Given UserName");
        }
        return foundUser;
    }

    public List<User> findUsersWithSameRole(String role){
        Roles userRole;
        try{
            userRole = Roles.valueOf(role.toUpperCase());
        }catch (IllegalArgumentException e){
            throw new InvalidInputException("Please Enter Valid Role: ADMIN, MANAGER, USER");
        }
        return userRepo.findByRole(userRole);
    }

    public User findUserById(int id){
        return userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Given Id Is Incorrect"));
    }

    public List<Task> userTasksById(int id){
        User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Given Id Is Incorrect"));
        if(user.getAssignedTasks().isEmpty()){
            throw new ResourceNotFoundException("No Assigned Tasks Yet");
        }
        return user.getAssignedTasks();
    }
    public User changeUserRole(int id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Given Id Is Incorrect"));

        // Toggle role
        if (user.getRole() == Roles.USER) {
            user.setRole(Roles.ADMIN);
        } else if (user.getRole() == Roles.ADMIN) {
            user.setRole(Roles.USER);
        }

        return userRepo.save(user);
    }


    public List<Task> getUserTasks(int id){
        User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Given Id Is Incorrect"));
        return user.getAssignedTasks();
    }
    public String verify(User user) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUserName(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(user.getUserName());
        } else {
            return "fail";
        }
    }
    public User addAdmin(UserRegistrationDTO userDto){
        User user = new User();
        if(userDto.getUserName()==null|| userDto.getUserName().trim().isEmpty()){
            throw new InvalidInputException("UserName Cannot Be Null");
        }
        if(!userDto.getEmail().endsWith("@gmail.com")){
            if (!userDto.getEmail().endsWith("@outlook.com")
            ) {
                if (!userDto.getEmail().endsWith("@yahoo.com")){
                    throw new InvalidInputException("Please enter valid email.");
                }
            }
        }
        if(userDto.getPassword()==null||userDto.getPassword().trim().isEmpty()){
            throw new InvalidInputException("Password Cannot Be Null");
        }
        user.setUserName(userDto.getUserName());
        user.setEmail(userDto.getEmail());
        user.setPassword(encoder.encode(userDto.getPassword()));
        user.setRole(Roles.ADMIN);
        return userRepo.save(user);
    }




}
