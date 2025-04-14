package com.DATN.Graduation.Project.controller;

import com.DATN.Graduation.Project.dto.UserDto;
import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.entity.UserEntity;
import com.DATN.Graduation.Project.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/saveUser")
    public ApiResponse<UserEntity> addUser(@RequestBody UserDto dto) {
        ApiResponse<UserEntity> response = new ApiResponse<>();
        response.setData(userService.saveUser(dto));
        return response;
    }

    @PostMapping("/setRole")
    public ApiResponse<String> setRole(@RequestParam Long id, @RequestParam String role) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(userService.setRole(id,role));
        return response;
    }

    @GetMapping("/getUser")
    public ApiResponse<UserEntity> getUser(@RequestParam Long id) {
        ApiResponse<UserEntity> response = new ApiResponse<>();
        response.setData(userService.getUser(id));
        return response;
    }
    @GetMapping("/getAll")
    public ApiResponse<List<UserEntity>> getAllUser() {
        ApiResponse<List<UserEntity>> response = new ApiResponse<>();
        response.setData(userService.getAllUser());
        return response;
    }
    @PutMapping
    public ApiResponse<String> deleteUser(@RequestParam Long id) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(userService.deleteUser(id));
        return response;
    }

}
