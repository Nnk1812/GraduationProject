package com.DATN.Graduation.Project.mapper;

import com.DATN.Graduation.Project.dto.ProductDetailDto;
import com.DATN.Graduation.Project.entity.ProductDetailEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductDetailDto toDto (ProductDetailEntity entity);
}
