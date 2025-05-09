package com.DATN.Graduation.Project.service;

import com.DATN.Graduation.Project.dto.DiscountDto;
import com.DATN.Graduation.Project.entity.DiscountEntity;

import java.util.List;

public interface DiscountService {
    DiscountEntity saveDiscount(DiscountDto dto);

    List<DiscountEntity> findAllIsDiscountValid();

    String hiddenDiscount(String code);

    String deleteDiscount(String code);

    boolean isDiscountValid(String code);

    String activateDiscount(String code);

    DiscountEntity getDetail(String code);

    List<DiscountEntity> findAll();
}
