package com.DATN.Graduation.Project.controller;

import com.DATN.Graduation.Project.dto.request.AuthenticateRequest;
import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.dto.response.AuthenticateResponse;
import com.DATN.Graduation.Project.service.AuthenticateService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticateController {
    @Autowired
    private AuthenticateService authenticateService;
    @PostMapping("/log-in")
    public ApiResponse<AuthenticateResponse> login(@RequestBody  AuthenticateRequest request){
        ApiResponse<AuthenticateResponse> response= new ApiResponse<>();
        response.setData(authenticateService.authenticate(request));
        return response;
    }
}
