package com.DATN.Graduation.Project.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class CartDto {
    private Long id;
    private String user;
    private Long totalPrice;
    private Integer totalQuantity;
    private String discount;
    private Long realPrice;
    private List<CartItemDto> cartItemDto;
}
