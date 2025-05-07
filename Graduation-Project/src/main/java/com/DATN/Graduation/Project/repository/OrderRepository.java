package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.dto.OrderDto;
import com.DATN.Graduation.Project.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    @Query(value ="select max(cast(substring(code, 3,length(code) ) as unsigned ) ) from orders where code like 'O%' ", nativeQuery = true)
    Integer findMaxCodeByPrefix();

    @Query(value = "select * from orders where " +
            "if(?1 is not null ,id <> ?1,1=1) and code = ?2 ",nativeQuery = true)
    List<OrderEntity> findByCode(Long id , String code);

    @Query("SELECT new com.DATN.Graduation.Project.dto.OrderDto(" +
            "o.id, o.code, o.employee, o.customer, o.status, o.totalPrice, " +
            "o.discount, o.realPrice, o.paymentMethod, o.priceToPay, o.paymentStatus, " +
            "o.address,o.phone, o.shippingFee, o.note, o.createdAt, o.updatedAt,o.userNameCustomer,o.deposit) " +
            "FROM OrderEntity o WHERE o.code = :code")
    Optional<OrderDto> findOrderDtoById(String code);

    @Query(value = "select * from orders a where a.username_customer =:code ",nativeQuery = true)
    List<OrderEntity> findOrdersByCustomerCode(String code);

    @Query(value = "select a.code from orders a ",nativeQuery = true)
    List<String> findAllCodes();


}
