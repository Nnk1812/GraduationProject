package com.DATN.Graduation.Project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FindProductDetailDto {
    private Long productId;
    private String code;
    private String productName;
    private Integer productType;
    private String brandCode;
    private String brandName;
    private String discountCode;
    private String discountName;
    private Long price;
    private Long realPrice;
    private String img;

    private String description;
    private String material;

    private String strapMaterial;

    private String movementType;

    private String waterResistance;

    private String dialSize;

    private String origin;
}
