package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.entity.CartEntity;
import com.DATN.Graduation.Project.entity.DiscountEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {
    @Query(value = "select * from cart where is_deleted = 0 and " +
            "if(?1 is not null ,id <> ?1,1=1) and code = ?2 ",nativeQuery = true)
    List<CartEntity> findByCode(Long id , String code);

    @Query(value ="select max(cast(substring(code, 3,length(code) ) as unsigned ) ) from cart where code like 'C%' ", nativeQuery = true)
    Integer findMaxCodeByPrefix();
}
