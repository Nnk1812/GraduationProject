package com.DATN.Graduation.Project.service;

import com.DATN.Graduation.Project.dto.DiscountDto;
import com.DATN.Graduation.Project.entity.DiscountEntity;

import java.util.List;

public interface DiscountService {
    DiscountEntity saveDiscount(DiscountDto dto);

    List<DiscountEntity> findAll();

    String hiddenDiscount(Long id);

    String deleteDiscount(Long id);

    boolean isDiscountValid(String code);
}
