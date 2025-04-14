package com.DATN.Graduation.Project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigInteger;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "brand")
@AllArgsConstructor
@NoArgsConstructor
public class BrandEntity {
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

    @Column(name = "email")
    @Basic
    private String email;

    @Column(name = "phone")
    @Basic
    private String phone;

    @Column(name = "address")
    @Basic
    private String address;

}
