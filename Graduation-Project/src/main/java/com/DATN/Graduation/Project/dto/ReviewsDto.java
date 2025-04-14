package com.DATN.Graduation.Project.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
public class ReviewsDto {
    public Long id;
    public String product;
    public String user;
    public Integer rating;
    public String comment;
    public LocalDateTime created_at;
    public LocalDateTime updated_at;
}
