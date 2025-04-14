package com.DATN.Graduation.Project.repository;

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
}
