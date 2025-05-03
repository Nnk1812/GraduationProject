package com.DATN.Graduation.Project.entity;

import jakarta.persistence.*;
        import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "report_import_warehouse")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportImportWarehouseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic
    private Long id;

    @Column(name = "code")
    @Basic
    private String code;

    @Column(name = "name")
    @Basic
    private String name;

    @Column(name = "import_date")
    @Basic
    private LocalDateTime importDate;

    @Column(name = "note")
    @Basic
    private String note;

    @Column(name = "employee")
    @Basic
    private String employee;

    @Column(name = "status")
    @Basic
    private Integer status;

    @Column(name = "discount")
    @Basic
    private String discount;

    @Column(name = "price")
    @Basic
    private Long price;

    @Column(name = "real_price")
    @Basic
    private Long realPrice;

}
