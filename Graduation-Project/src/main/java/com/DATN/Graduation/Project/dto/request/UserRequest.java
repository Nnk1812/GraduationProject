package com.DATN.Graduation.Project.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class UserRequest {
    private String userName;
    private String passWord;
    private String fullName;
    private String code;
    private Date dateIn;
    private Date dateOut;
    private String email;
    private String phone;
    private String role;
}


