package com.DATN.Graduation.Project.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class DiscountDto {
    private Long id;
    private String code;
    private Boolean isDeleted;
    private Boolean isActive;
    private String name;
    private Integer type;
    private Integer value;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
