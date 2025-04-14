package com.DATN.Graduation.Project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BrandDto {
    private Long id;
    private String code;
    private Boolean isDeleted;
    private Boolean isActive;
    private String name;
    private String email;
    private String phone;
    private String address;
}
