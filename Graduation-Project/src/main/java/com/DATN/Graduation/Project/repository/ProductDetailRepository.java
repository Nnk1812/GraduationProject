package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.entity.ProductDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetailEntity, Long> {
    @Query(value = "select * from product_detail a " +
            "where a.product = :productCode and is_deleted = 0",nativeQuery = true)
    Optional<ProductDetailEntity> findByProduct(String productCode);



}
