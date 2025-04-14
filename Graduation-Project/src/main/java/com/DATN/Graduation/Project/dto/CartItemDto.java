package com.DATN.Graduation.Project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemDto {
    private Long id;
    private String user;
    private String product;
    private String name;
    private Long price;
    private Long realPrice;
    private Integer quantity;
    private Long totalPrice;
}
