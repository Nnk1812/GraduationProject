package com.DATN.Graduation.Project.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class AuthenticateRequest {
    public String username;
    public String password;
}
