package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.entity.BrandEntity;
import com.DATN.Graduation.Project.entity.DiscountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<BrandEntity, Long> {
    @Query(value = "select a.code  from brand a"
            ,nativeQuery = true)
    List<String> findBrand();

    @Query(value ="select max(cast(substring(code, 3,length(code) ) as unsigned ) ) from brand where code like 'B%' ", nativeQuery = true)
    Integer findMaxCodeByPrefix();

    @Query(value = "select * from brand where is_deleted = 0 and " +
            "if(?1 is not null ,id <> ?1,1=1) and code = ?2 ",nativeQuery = true)
    List<BrandEntity> findByCode(Long id , String code);

    @Query(value = "select  a.name from brand a" ,nativeQuery = true)
    List<String> findBrandName();

    @Query(value = "select  a.name from brand a where a.code =:code" ,nativeQuery = true)
    String findBrandNameByCode(String code);

    BrandEntity findByCode(String code);
}
