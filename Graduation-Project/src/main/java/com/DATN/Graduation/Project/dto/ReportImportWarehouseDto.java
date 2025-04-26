package com.DATN.Graduation.Project.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ReportImportWarehouseDto {
    private Long id;
    private String code;
    private String name;
    private LocalDateTime importDate;
    private String brand;
    private String note;
    private String employee;
    private String discount;
    private Integer status;
    private Long price;
    private Long realPrice;
    private List<WarehouseImportProductDto> products;
}
