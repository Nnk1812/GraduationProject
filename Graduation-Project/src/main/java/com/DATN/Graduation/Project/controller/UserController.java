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
    public ApiResponse<String> setRole(@RequestParam String code, @RequestParam String role) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(userService.setRole(code,role));
        return response;
    }

    @GetMapping("/detail")
    public ApiResponse<UserEntity> getUser(@RequestParam String code) {
        ApiResponse<UserEntity> response = new ApiResponse<>();
        response.setData(userService.getUser(code));
        return response;
    }
    @GetMapping("/findAll")
    public ApiResponse<List<UserEntity>> getAllUser() {
        ApiResponse<List<UserEntity>> response = new ApiResponse<>();
        response.setData(userService.getAllUser());
        return response;
    }
    @PutMapping("/delete")
    public ApiResponse<String> deleteUser(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(userService.deleteUser(code));
        return response;
    }
    @PostMapping("/hidden")
    public ApiResponse<String> hiddenUser(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(userService.hiddenUser(code));
        return response;
    }
    @PostMapping("/active")
    public ApiResponse<String> activeUser(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(userService.activeUser(code));
        return response;
    }
    @GetMapping("/findUser")
    public ApiResponse<UserEntity> findByUserName(@RequestParam String user) {
        ApiResponse<UserEntity> response = new ApiResponse<>();
        response.setData(userService.getUserByUserName(user));
        return response;
    }

    @PostMapping("/changePassword")
    public ApiResponse<String> changePassword(@RequestParam String code, @RequestParam String password, @RequestParam String newPassword) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(userService.changePassword(code,password,newPassword));
        return response;
    }
    @PostMapping("/setPassword")
    public ApiResponse<String> setPassword(@RequestParam String code, @RequestParam String password) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(userService.setPassword(code,password));
        return response;
    }
}
