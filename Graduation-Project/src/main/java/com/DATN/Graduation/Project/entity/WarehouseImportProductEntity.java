package com.DATN.Graduation.Project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "warehouse_import_product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseImportProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_import_warehouse")
    private  String reportImportWarehouse;

    @Column(name = "code")
    private String code;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private Long price;

    @Column(name = "total_price")
    private Long totalPrice;
}
