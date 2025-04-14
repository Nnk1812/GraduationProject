package com.DATN.Graduation.Project.mapper;

import com.DATN.Graduation.Project.dto.OrderDetailDto;
import com.DATN.Graduation.Project.entity.OrderDetailEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    List<OrderDetailDto> toDto(List<OrderDetailEntity> entity);
}
