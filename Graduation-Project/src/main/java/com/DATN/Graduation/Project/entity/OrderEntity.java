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
@Table(name = "orders")
@AllArgsConstructor
@NoArgsConstructor
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic
    @Column(name = "id")
    private Long id;

    @Column(name = "code")
    @Basic
    private String code;

    @Column(name = "employee")
    @Basic
    private String employee;

    @Column(name = "customer")
    @Basic
    private String customer;

    @Column(name = "status")
    @Basic
    private Integer status;

    @Column(name = "total_price")
    @Basic
    private Long totalPrice;

    @Column(name = "discount")
    @Basic
    private String discount;

    @Column(name = "real_price")
    @Basic
    private Long realPrice;

    @Column(name = "payment_method")
    @Basic
    private String paymentMethod;

    @Column(name = "price_to_pay")
    @Basic
    private Long priceToPay;

    @Column(name = "status_payment")
    @Basic
    private Integer paymentStatus;

    @Column(name = "phone")
    @Basic
    private String phone;

    @Column(name = "address")
    @Basic
    private String address;

    @Column(name = "shipping_fee")
    @Basic
    private Long shippingFee;

    @Column(name = "note")
    @Basic
    private String note;

    @Column(name = "created_at")
    @Basic
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @Basic
    private LocalDateTime updatedAt;
}



