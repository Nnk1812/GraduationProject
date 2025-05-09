package com.DATN.Graduation.Project.service;

import com.DATN.Graduation.Project.dto.BrandDto;
import com.DATN.Graduation.Project.entity.BrandEntity;

import java.util.List;

public interface BrandService {
    BrandEntity saveBrand(BrandDto dto);

    String hiddenBrand(Long id);

    List<BrandEntity> findAll();

    String deleteBrand(String code);

    BrandEntity getDetail(String code);

    String findBrandByCode(String code);
}
