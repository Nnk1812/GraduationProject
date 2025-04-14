package com.DATN.Graduation.Project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDetailDto {
    private Long id;
    private String orderCode;
    private String product;
    private String price;
    private Integer quantity;
    private Long totalPrice;
}
