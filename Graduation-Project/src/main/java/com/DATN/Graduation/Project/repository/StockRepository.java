package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.entity.StockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRepository extends JpaRepository<StockEntity,Long> {
    @Query(value = "select * from stock a where a.product =:code",nativeQuery = true)
    StockEntity findByProduct(String code);
}
