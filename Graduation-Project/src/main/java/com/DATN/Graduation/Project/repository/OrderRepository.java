package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.dto.OrderDto;
import com.DATN.Graduation.Project.dto.StatisticalDto;
import com.DATN.Graduation.Project.dto.StatisticalReviewDto;
import com.DATN.Graduation.Project.entity.OrderEntity;
import org.hibernate.query.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    @Query(value ="select max(cast(substring(code, 3,length(code) ) as unsigned ) ) from orders where code like 'O%' ", nativeQuery = true)
    Integer findMaxCodeByPrefix();

    @Query(value = "select * from orders where " +
            "if(?1 is not null ,id <> ?1,1=1) and code = ?2 ",nativeQuery = true)
    List<OrderEntity> findByCode(Long id , String code);

    @Query(value = "select * from orders a where a.code =:code ",nativeQuery = true)
    Optional<OrderEntity> findByCode(String code);

    @Query("SELECT new com.DATN.Graduation.Project.dto.OrderDto(" +
            "o.id, o.code, o.employee, o.customer, o.status, o.totalPrice, " +
            "o.discount, o.realPrice, o.paymentMethod, o.priceToPay, o.paymentStatus, " +
            "o.address,o.phone, o.shippingFee, o.note, o.createdAt, o.updatedAt,o.userNameCustomer,o.deposit,o.codeCustomer) " +
            "FROM OrderEntity o WHERE o.code = :code")
    Optional<OrderDto> findOrderDtoById(String code);

    @Query(value = "select * from orders a where a.username_customer =:code ",nativeQuery = true)
    List<OrderEntity> findOrdersByCustomerCode(String code);

    @Query(value = "select a.code from orders a ",nativeQuery = true)
    List<String> findAllCodes();

    @Query(value = "select b.quantity from orders a " +
            "inner join order_detail b on a.code = b.order_code " +
            "where a.code =:code and b.product =:product",nativeQuery = true)
    Integer findQuantityByCode(String code,String product);

    @Query(value = "select * from orders a " +
            "where a.code_customer =:code",nativeQuery = true)
    List<OrderEntity> findOrdersByCodeCustomer(String code);

    @Query(value = "select a.* from orders a " +
            "left join order_detail b on a.code = b.order_code " +
            "where a.code_customer =:customer and b.product =:product and a.code=:order and a.status = 6",nativeQuery = true)
    List<OrderEntity> findOrdersCustomer(String customer,String product,String order);
    @Query("SELECT new com.DATN.Graduation.Project.dto.StatisticalDto(" +
            "    COUNT(*), " +
            "    SUM(CASE WHEN status = 6 THEN realPrice ELSE 0 END), " +
            "    SUM(CASE WHEN status = 6 THEN 1 ELSE 0 END) , " +
            "    SUM(CASE WHEN status = 7 THEN 1 ELSE 0 END) , " +
            "   SUM(CASE WHEN status = 9 THEN 1 ELSE 0 END)) " +
            "FROM OrderEntity " )
    StatisticalDto findAllStatistical();
    @Query("SELECT new com.DATN.Graduation.Project.dto.StatisticalDto(" +
            "    COUNT(*), " +
            "    SUM(CASE WHEN status = 6 THEN realPrice ELSE 0 END), " +
            "    SUM(CASE WHEN status = 6 THEN 1 ELSE 0 END) , " +
            "    SUM(CASE WHEN status = 7 THEN 1 ELSE 0 END) , " +
            "   SUM(CASE WHEN status = 9 THEN 1 ELSE 0 END)) " +
            "FROM OrderEntity " +
            "where DATE (updatedAt) between :startDate and :endDate ")
    StatisticalDto findByDate(Date startDate , Date endDate);

    @Query(value =
            "SELECT months.month AS month, COALESCE(SUM(o.real_price), 0) AS totalIncome " +
                    "FROM ( " +
                    "  SELECT 1 AS month UNION ALL " +
                    "  SELECT 2 UNION ALL " +
                    "  SELECT 3 UNION ALL " +
                    "  SELECT 4 UNION ALL " +
                    "  SELECT 5 UNION ALL " +
                    "  SELECT 6 UNION ALL " +
                    "  SELECT 7 UNION ALL " +
                    "  SELECT 8 UNION ALL " +
                    "  SELECT 9 UNION ALL " +
                    "  SELECT 10 UNION ALL " +
                    "  SELECT 11 UNION ALL " +
                    "  SELECT 12 " +
                    ") AS months " +
                    "LEFT JOIN orders o ON MONTH(o.created_at) = months.month " +
                    "AND YEAR(o.created_at) = :year " +
                    "AND o.status = 6 " +
                    "GROUP BY months.month " +
                    "ORDER BY months.month", nativeQuery = true)
    List<Object[]> getMonthlyIncome(Integer year);


}
