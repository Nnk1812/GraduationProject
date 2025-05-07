package com.DATN.Graduation.Project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "report_warranty")
@AllArgsConstructor
@NoArgsConstructor
public class ReportWarrantyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic
    private Long id;

    @Column(name = "code")
    @Basic
    private String code;

    @Column(name = "order_code")
    @Basic
    private String order;

    @Column(name = "product")
    @Basic
    private String product;

    @Column(name = "employee")
    @Basic
    private String employee;

    @Column(name = "customer")
    @Basic
    private String customer;

    @Column(name = "status")
    @Basic
    private Integer status;

    @Column(name = "quantity")
    @Basic
    private Integer quantity;

    @Column(name = "warranty_date")
    @Basic
    private LocalDateTime warrantyDate;

    @Column(name = "complete_date")
    @Basic
    private LocalDateTime completeDate;
}
