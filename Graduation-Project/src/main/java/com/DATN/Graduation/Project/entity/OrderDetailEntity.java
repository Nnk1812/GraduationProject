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
@Table(name = "order_detail")
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic
    @Column(name = "id")
    private Long id;

    @Column(name = "order_code")
    @Basic
    private String orderCode;

    @Column(name = "product")
    @Basic
    private String product;

    @Column(name = "price")
    @Basic
    private Long price;

    @Column(name = "quantity")
    @Basic
    private Integer quantity;

    @Column(name = "total_price")
    @Basic
    private Long totalPrice;
}
