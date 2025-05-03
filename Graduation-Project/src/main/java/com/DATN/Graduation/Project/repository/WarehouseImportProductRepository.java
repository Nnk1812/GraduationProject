package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.entity.WarehouseImportProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseImportProductRepository  extends JpaRepository<WarehouseImportProductEntity,Long> {
    @Query(value = "select * from warehouse_import_product a where a.report_import_warehouse =:code",nativeQuery = true)
    List<WarehouseImportProductEntity> findByCode(String code);
}
