package com.DATN.Graduation.Project.mapper;

import com.DATN.Graduation.Project.dto.BrandDto;
import com.DATN.Graduation.Project.entity.BrandEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BrandMapper {
    BrandEntity toBrandEntity(BrandDto brandDto);
}
