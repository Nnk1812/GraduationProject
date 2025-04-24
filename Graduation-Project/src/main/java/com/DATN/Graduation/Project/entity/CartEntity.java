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
@Table(name = "cart")
@AllArgsConstructor
@NoArgsConstructor
public class CartEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic
    @Column(name = "id")
    private Long id;

    @Column(name = "code")
    @Basic
    private String code;

    @Column(name = "user")
    @Basic
    private String user;

    @Column(name = "total_price")
    @Basic
    private Long totalPrice;

    @Column(name = "total_quantity")
    @Basic
    private Integer totalQuantity;

    @Column(name = "discount")
    @Basic
    private String discount;

    @Column(name = "real_price")
    @Basic
    private Long realPrice;
}
