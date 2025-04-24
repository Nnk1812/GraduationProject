package com.DATN.Graduation.Project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "report_import_warehouse")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportImportWarehouseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "import_date")
    private LocalDate importDate;

    @Column(name = "brand")
    private String brand;

    @Column(name = "note")
    private String note;

    @Column(name = "employee")
    private Long employee;
}
