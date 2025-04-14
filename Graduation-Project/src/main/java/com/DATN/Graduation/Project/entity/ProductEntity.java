package com.DATN.Graduation.Project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "product")
@AllArgsConstructor
@NoArgsConstructor
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic
    @Column(name = "id")
    private Long id;

    @Column(name = "code")
    @Basic
    private String code;

    @Column(name = "is_deleted")
    @Basic
    private Boolean isDeleted;

    @Column(name = "is_active")
    @Basic
    private Boolean isActive;

    @Column(name = "name")
    @Basic
    private String name;

    @Column(name = "brand")
    @Basic
    private String brand;

    @Column(name = "quantity")
    @Basic
    private Integer quantity;

    @Column(name = "price")
    @Basic
    private Long price;

    @Column(name = "discount")
    @Basic
    private String discount;

    @Column(name = "description")
    @Basic
    private String description;

    @Column(name = "real_price")
    @Basic
    private Long realPrice;

}
