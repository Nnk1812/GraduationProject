package com.DATN.Graduation.Project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WarrantyDetailDto
{
    private String code;
    private String order;
    private String product;
    private String employee;
    private String customer;
    private Integer status;
    private Integer quantity;
    private LocalDateTime warrantyDate;
    private LocalDateTime completeDate;
    private String productName;
    private String brandName;
    private Integer type;
}
