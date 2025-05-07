package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.entity.OrderEntity;
import com.DATN.Graduation.Project.entity.ReportWarrantyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReportWarrantyRepository extends JpaRepository<ReportWarrantyEntity,Long> {
    @Query(value ="select max(cast(substring(code, 3,length(code) ) as unsigned ) ) from report_warranty where code like 'O%' ", nativeQuery = true)
    Integer findMaxCodeByPrefix();

    @Query(value = "select * from report_warranty where " +
            "if(?1 is not null ,id <> ?1,1=1) and code = ?2 ",nativeQuery = true)
    List<OrderEntity> findByCode(Long id , String code);

    @Query(value = "select * from report_warranty a where a.code =:code",nativeQuery = true)
    Optional<ReportWarrantyEntity> findByCode(String code);

    @Query(value = "select * from report_warranty a where a.customer =:user",nativeQuery = true)
    List<ReportWarrantyEntity> findByCustomer(String user);
}
