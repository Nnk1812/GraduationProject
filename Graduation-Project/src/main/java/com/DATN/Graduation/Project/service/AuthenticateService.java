package com.DATN.Graduation.Project.service;

import com.DATN.Graduation.Project.dto.request.AuthenticateRequest;
import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.dto.response.AuthenticateResponse;

public interface AuthenticateService {
    AuthenticateResponse authenticate(AuthenticateRequest authenticateRequest);
}
