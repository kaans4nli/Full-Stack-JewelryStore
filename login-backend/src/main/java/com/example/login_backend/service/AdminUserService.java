package com.example.login_backend.service;

import com.example.login_backend.dto.UserDto;
import com.example.login_backend.dto.UserRequest;

import java.util.List;

public interface AdminUserService {

    List<UserDto> getAllUsers();
    UserDto getUserById(Long id);
    UserDto createUser(UserRequest request);
    UserDto updateUser(Long id, UserRequest request);
    void deleteUser(Long id);
}
