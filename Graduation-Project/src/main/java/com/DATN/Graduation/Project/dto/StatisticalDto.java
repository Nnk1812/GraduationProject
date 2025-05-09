package com.DATN.Graduation.Project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatisticalDto {
    private Long sumOrder;
    private Long revenue;
    private Long successOrder;
    private Long failedOrder;
    private Long returnOrder;
}
