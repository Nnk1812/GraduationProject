package com.DATN.Graduation.Project.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
public class ReportWarrantyDto {
    private Long id;
    private String code;
    private String order;
    private String product;
    private String employee;
    private String customer;
    private Integer status;
    private LocalDateTime warrantyDate;
    private LocalDateTime completeDate;
}
