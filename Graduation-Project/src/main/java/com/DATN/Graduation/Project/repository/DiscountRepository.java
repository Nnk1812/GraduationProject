package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.entity.DiscountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiscountRepository  extends JpaRepository<DiscountEntity, Long> {
    @Query(value = "select a.code from discount a " ,nativeQuery = true)
    List<String> findDiscount();

    @Query(value = "select * from discount where is_deleted = 0 and " +
            "if(?1 is not null ,id <> ?1,1=1) and code = ?2 ",nativeQuery = true)
    List<DiscountEntity> findByCode(Long id , String code);

    @Query(value ="select max(cast(substring(code, 3,length(code) ) as unsigned ) ) from discount where code like 'D%' ", nativeQuery = true)
    Integer findMaxCodeByPrefix();

    DiscountEntity findByCode(String code);

    @Query(value = "select a.type " +
            "from discount a " +
            "where a.code =:code",nativeQuery = true)
    Integer getDiscountType(String code);

    @Query(value = "select a.value " +
            "from discount a " +
            "where a.code =:code ",nativeQuery = true)
    Integer getDiscountValue(String code);

    @Query("SELECT d FROM DiscountEntity d WHERE d.code = :code AND d.isDeleted = false AND d.isActive = true AND :now BETWEEN d.startDate AND d.endDate")
    Optional<DiscountEntity> findValidDiscountByCode(String code, LocalDateTime now);

    @Query("select d from DiscountEntity d where d.isDeleted = false AND :now BETWEEN d.startDate AND d.endDate")
    List<DiscountEntity> findAllDeleted(LocalDateTime now);
}

