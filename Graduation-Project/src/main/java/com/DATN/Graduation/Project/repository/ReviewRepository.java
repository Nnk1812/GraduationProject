package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.dto.StatisticalReviewDto;
import com.DATN.Graduation.Project.entity.ReviewsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewsEntity, Long> {
    @Query(value = "select a.rating from reviews a " +
            "where a.product =:code",nativeQuery = true)
    List<Double> findAllByCode(String code);
    @Query(value = "select * from reviews a " +
            "where a.product =:code",nativeQuery = true)
    List<ReviewsEntity> findAllReviewByProduct(String code);

    @Query("select new com.DATN.Graduation.Project.dto.StatisticalReviewDto(" +
            "count(*), " +
            "SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END)) " +
            "from ReviewsEntity")
    StatisticalReviewDto getReviewStatistics();


}
