package com.DATN.Graduation.Project.dto;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Setter
@Getter
public class UserDto {
    private Long id;
    private Boolean isActive;
    private Boolean isDeleted;
    private String userName;
    private String passWord;
    private String fullName;
    private String code;
    private LocalDateTime dateIn;
    private LocalDateTime dateOut;
    private String email;
    private String phone;
    private String role;
    private String sex;
    private String address;
}
