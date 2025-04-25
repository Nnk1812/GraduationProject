package com.DATN.Graduation.Project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ShoppingCartDto
{
    private String code;
    private String name;
    private String img;
    private Long price;
    private String discount;
    private Integer quantity;
    private Long realPrice;
}
