package com.DATN.Graduation.Project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "reviews")
@AllArgsConstructor
@NoArgsConstructor
public class ReviewsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic
    @Column(name = "id")
    private Long id;

    @Column(name = "product")
    @Basic
    private String product;

    @Column(name = "user")
    @Basic
    private String user;

    @Column(name = "rating")
    @Basic
    private Integer rating;

    @Column(name = "comment")
    @Basic
    private String comment;

    @Column(name = "created_at")
    @Basic
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    @Basic
    private LocalDateTime updated_at;
}
