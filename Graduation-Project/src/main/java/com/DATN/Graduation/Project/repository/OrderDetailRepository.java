package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.entity.OrderDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetailEntity, Long> {
    Optional<OrderDetailEntity> findByOrderCode(String order);

    @Query(value = "select * from order_detail a where a.order_code =:code ",nativeQuery = true)
    List<OrderDetailEntity> findAllByOrderCode(String code);
}
