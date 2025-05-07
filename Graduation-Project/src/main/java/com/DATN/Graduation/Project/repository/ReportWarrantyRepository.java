package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.dto.WarrantyDetailDto;
import com.DATN.Graduation.Project.dto.WarrantyDto;
import com.DATN.Graduation.Project.entity.OrderEntity;
import com.DATN.Graduation.Project.entity.ReportWarrantyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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

    @Query("select new com.DATN.Graduation.Project.dto.WarrantyDto(a.code,a.product,b.name,c.fullName,c.phone,a.status,a.warrantyDate,a.completeDate,b.image,a.quantity)" +
            "from ReportWarrantyEntity a " +
            "left join ProductEntity b on a.product=b.code " +
            "left join UserEntity c on a.employee = c.code " +
            "where a.customer =:code ")
    List<WarrantyDto> findAllWarrantyByEmployee(String code);

    @Query("select new com.DATN.Graduation.Project.dto.WarrantyDetailDto(a.code,a.order,a.product,a.employee,a.customer, " +
            "a.status,a.quantity,a.warrantyDate,a.completeDate,b.name,d.name,b.type)" +
            "from ReportWarrantyEntity a " +
            "left join ProductEntity b on a.product=b.code " +
            "left join UserEntity c on a.employee = c.code " +
            "left join BrandEntity d on d.code = b.brand " +
            "where a.code =:code ")
    WarrantyDetailDto findWarrantyDetail(String code);
    @Query("select new com.DATN.Graduation.Project.dto.WarrantyDto(a.code,a.product,b.name,c.fullName,c.phone,a.status,a.warrantyDate,a.completeDate,b.image,a.quantity,a.order,a.customer)" +
            "from ReportWarrantyEntity a " +
            "left join ProductEntity b on a.product=b.code " +
            "left join UserEntity c on a.employee = c.code ")
    List<WarrantyDto> findAllWarranty();


}
