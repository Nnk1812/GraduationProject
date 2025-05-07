package com.DATN.Graduation.Project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StatisticalReviewDto {
    private Long totalReviews;
    private Double averageRating;
    private Long star1;
    private Long star2;
    private Long star3;
    private Long star4;
    private Long star5;

    public StatisticalReviewDto(Long totalReviews, Long star1, Long star2, Long star3, Long star4, Long star5) {
        this.totalReviews = totalReviews;
        this.star1 = star1;
        this.star2 = star2;
        this.star3 = star3;
        this.star4 = star4;
        this.star5 = star5;
    }
}
