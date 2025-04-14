package com.DATN.Graduation.Project.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RatingDto {
    private Integer ratingCount;
    private Double rating;
}
