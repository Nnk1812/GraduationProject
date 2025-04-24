package com.DATN.Graduation.Project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FindAllProductDto {
    private String code;
    private String productName;
    private Integer productType;
    private String brandCode;
    private String brandName;
    private String discountCode;
    private String discountName;
    private Long price;
    private Long realPrice;
}
