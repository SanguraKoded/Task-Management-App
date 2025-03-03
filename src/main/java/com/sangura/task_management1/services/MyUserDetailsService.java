package com.sangura.task_management1.services;

import com.sangura.task_management1.dtos.UserRegistrationDTO;
import com.sangura.task_management1.entities.User;
import com.sangura.task_management1.entities.UserPrincipal;
import com.sangura.task_management1.exceptions.ResourceNotFoundException;
import com.sangura.task_management1.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;


    @Override
    public UserDetails loadUserByUsername(String userName) throws ResourceNotFoundException {
        User user = userRepo.findUserByUserName(userName);
        if (user == null) {
            System.out.println("User Not Found");
            throw new UsernameNotFoundException("user not found");
        }

        return new UserPrincipal(user);
    }
}
