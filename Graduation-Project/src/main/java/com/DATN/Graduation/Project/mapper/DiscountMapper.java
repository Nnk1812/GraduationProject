package com.DATN.Graduation.Project.mapper;

import com.DATN.Graduation.Project.dto.DiscountDto;
import com.DATN.Graduation.Project.entity.DiscountEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DiscountMapper {
    DiscountEntity toDiscount(DiscountDto dto);
}
