package com.DATN.Graduation.Project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "product_detail")
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetailEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic
    @Column(name = "id")
    private Long id;

    @Column(name = "product")
    @Basic
    private String product;

    @Column(name = "is_deleted")
    @Basic
    private Boolean isDeleted;

    @Column(name = "is_active")
    @Basic
    private Boolean isActive;

    @Column(name = "material")
    @Basic
    private String material;

    @Column(name = "strap_material")
    @Basic
    private String strapMaterial;

    @Column(name = "movement_type")
    @Basic
    private String movementType;

    @Column(name = "water_resistance")
    @Basic
    private String waterResistance;

    @Column(name = "dial_size")
    @Basic
    private String dialSize;

    @Column(name = "origin")
    @Basic
    private String origin;

    @Column(name = "image")
    @Basic
    private String image;
}
