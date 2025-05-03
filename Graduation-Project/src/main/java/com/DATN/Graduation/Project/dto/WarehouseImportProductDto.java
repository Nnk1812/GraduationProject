package com.DATN.Graduation.Project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WarehouseImportProductDto {
    private Long id;
    private String reportImportWarehouse;
    private String product;
    private String name;
    private String brand;
    private Long quantity;
    private String discount;
    private Long price;
    private Long totalPrice;
    private Long realPrice;

}
