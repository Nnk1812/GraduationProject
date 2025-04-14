package com.DATN.Graduation.Project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "cart_item")
@AllArgsConstructor
@NoArgsConstructor
public class CartItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic
    @Column(name = "id")
    private Long id;

    @Column(name = "user")
    @Basic
    private String user;

    @Column(name = "product")
    @Basic
    private String product;

    @Column(name = "name")
    @Basic
    private String name;

    @Column(name = "price")
    @Basic
    private Long price;

    @Column(name = "real_price")
    @Basic
    private Long realPrice;

    @Column(name = "quantity")
    @Basic
    private Integer quantity;

    @Column(name = "totalPrice")
    @Basic
    private Long totalPrice;
}
