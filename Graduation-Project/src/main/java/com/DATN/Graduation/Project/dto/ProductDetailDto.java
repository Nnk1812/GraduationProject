package com.DATN.Graduation.Project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDetailDto {
    private Long id;

    private String productCode;

    private Boolean isDeleted;

    private Boolean isActive;

    private String material;

    private String strapMaterial;

    private String movementType;

    private String waterResistance;

    private String dialSize;

    private String origin;

}
