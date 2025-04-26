package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.entity.WarehouseImportProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WarehouseImportProductRepository  extends JpaRepository<WarehouseImportProductEntity,Long> {
}
