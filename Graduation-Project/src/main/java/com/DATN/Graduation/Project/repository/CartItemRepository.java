package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.entity.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {

    @Query(value = "select * from cart_item a where a.product =:product and a.user =:user",nativeQuery = true)
    Optional<CartItemEntity> findByProduct(String product,String user);


    @Query(value = "select a.product from cart_item a",nativeQuery = true)
    List<String> findAllProducts();

    @Query(value = "select a.quantity from cart_item a where a.product =:code ",nativeQuery = true)
    Integer findQuantityOfProduct(String code);
}
