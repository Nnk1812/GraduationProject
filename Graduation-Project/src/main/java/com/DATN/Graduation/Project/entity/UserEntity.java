package com.DATN.Graduation.Project.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "User")
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic
    @Column(name = "id")
    private Long id;

    @Column(name = "is_deleted")
    @Basic
    private Boolean isDeleted;

    @Column(name = "is_active")
    @Basic
    private Boolean isActive;

    @Basic
    @Column(name = "username")
    private String userName;

    @Basic
    @Column(name = "password")
    private String passWord;

    @Basic
    @Column(name = "full_name")
    private String fullName;

    @Basic
    @Column(name = "code")
    private  String code;

    @Basic
    @Column(name = "date_in")
    private LocalDateTime dateIn;

    @Basic
    @Column(name = "date_out")
    private  LocalDateTime dateOut;

    @Basic
    @Column(name = "email")
    private  String email;

    @Basic
    @Column(name = "phone")
    private  String phone;

    @Basic
    @Column(name = "role")
    private  String role;
}
