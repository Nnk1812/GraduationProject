package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.entity.StockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRepository extends JpaRepository<StockEntity,Long> {
}
