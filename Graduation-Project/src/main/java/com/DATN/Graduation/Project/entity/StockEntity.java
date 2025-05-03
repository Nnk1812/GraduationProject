package com.DATN.Graduation.Project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report")
    private String report;

    @Column(name = "product")
    private String product;

    @Column(name = "name")
    private String  name;

    @Column(name = "quantity")
    private Long quantity;

    @Column(name = "import_date")
    private LocalDateTime importDate;

    @Column(name = "import_price")
    private Long importPrice;

    @Column(name = "selling_price")
    private Long sellingPrice;

    @Column(name = "note")
    private String note;

}
