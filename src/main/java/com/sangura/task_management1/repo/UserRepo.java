package com.sangura.task_management1.repo;

import com.sangura.task_management1.entities.User;
import com.sangura.task_management1.enums.Roles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepo extends JpaRepository<User, Integer> {
    User findUserByUserName(String userName);
    List<User> findByRole(Roles role);
    Boolean existsByUserName(String userName);
}
