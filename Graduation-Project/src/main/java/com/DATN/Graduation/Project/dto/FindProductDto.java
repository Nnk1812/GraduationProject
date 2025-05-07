package com.DATN.Graduation.Project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FindProductDto {
    private String name ;
    private Long price;
    private Long realPrice;
    private Integer discount;
    private String img;
    private String description;
    private String code;
    private Integer type;
    private String brand;
    private Long quantity;
}
