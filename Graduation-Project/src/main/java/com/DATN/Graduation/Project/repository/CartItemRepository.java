package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.dto.ShoppingCartDto;
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

    @Query("select new com.DATN.Graduation.Project.dto.ShoppingCartDto(a.product,b.name,b.image,a.price,a.quantity,a.realPrice)" +
            "from CartItemEntity a " +
            "inner join ProductEntity b on a.product = b.code " +
            "inner join UserEntity  c on a.user = c.userName " +
            "where a.user =:user " )
    List<ShoppingCartDto> findAllProductInCart(String user);

    @Query(value = "select * from cart_item a " +
            "where a.user =:user and a.product =:product ",nativeQuery = true)
    Optional<CartItemEntity> findByUserAndProduct(String user,String product);
}
