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
public class WarrantyDto {
    private String code;
    private String product;
    private String productName;
    private String employee;
    private String SDT;
    private Integer status;
    private LocalDateTime receive_date;
    private LocalDateTime complete_date;
    private String image;
    private Integer quantity;
    private String order;
    private String customer;

    public WarrantyDto(String code, String product, String productName, String employee, String SDT, Integer status, LocalDateTime receive_date, LocalDateTime complete_date, String image, Integer quantity) {
        this.code = code;
        this.product = product;
        this.productName = productName;
        this.employee = employee;
        this.SDT = SDT;
        this.status = status;
        this.receive_date = receive_date;
        this.complete_date = complete_date;
        this.image = image;
        this.quantity = quantity;
    }
}
