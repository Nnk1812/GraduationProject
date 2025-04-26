package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.entity.ReportImportWarehouseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportImportWarehouseRepository extends JpaRepository<ReportImportWarehouseEntity,Long> {
    @Query(value = "select * from report_import_warehouse where  " +
            "if(?1 is not null ,id <> ?1,1=1) and code = ?2 ",nativeQuery = true)
    List<ReportImportWarehouseEntity> findByCode(Long id , String code);

    @Query(value ="select max(cast(substring(code, 3,length(code) ) as unsigned ) ) from report_import_warehouse where code like 'W%' ", nativeQuery = true)
    Integer findMaxCodeByPrefix();
}
