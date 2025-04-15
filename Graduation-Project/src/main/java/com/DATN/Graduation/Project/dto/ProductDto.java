package com.DATN.Graduation.Project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;

    private String code;

    private String name;

    private Boolean isDeleted;

    private Boolean isActive;

    private String brand;

    private Integer quantity;

    private Long price;

    private String discount;

    private String description;

    private Long realPrice;

    private String image;

    private ProductDetailDto productDetail;

    public ProductDto(Long id, String code, String name, Boolean isDeleted, Boolean isActive,
                      String brand, Integer quantity, Long price, String discount, String description,String image) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.isDeleted = isDeleted;
        this.isActive = isActive;
        this.brand = brand;
        this.quantity = quantity;
        this.price = price;
        this.discount = discount;
        this.description = description;
        this.image = image;
    }

}
