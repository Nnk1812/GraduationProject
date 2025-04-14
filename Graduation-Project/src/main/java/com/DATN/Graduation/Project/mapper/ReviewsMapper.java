package com.DATN.Graduation.Project.mapper;

import com.DATN.Graduation.Project.dto.ReviewsDto;
import com.DATN.Graduation.Project.entity.ReviewsEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReviewsMapper {
    ReviewsEntity toEntity(ReviewsDto dto);
}
