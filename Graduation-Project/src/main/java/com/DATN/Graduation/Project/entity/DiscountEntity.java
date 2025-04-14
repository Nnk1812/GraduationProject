package com.DATN.Graduation.Project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "discount")
@AllArgsConstructor
@NoArgsConstructor
public class DiscountEntity {
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

    @Column(name = "type")
    @Basic
    private Integer type;

    @Column(name = "value")
    @Basic
    private Integer value;

    @Column(name = "start_date")
    @Basic
    private LocalDateTime startDate;

    @Column(name = "end_date")
    @Basic
    private LocalDateTime endDate;

}
