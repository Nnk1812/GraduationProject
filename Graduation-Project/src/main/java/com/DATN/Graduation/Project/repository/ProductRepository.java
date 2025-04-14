package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.dto.ProductDto;
import com.DATN.Graduation.Project.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    @Query(value = "select * from product where is_deleted = 0 and " +
            "if(?1 is not null ,id <> ?1,1=1) and code = ?2 ",nativeQuery = true)
    List<ProductEntity> findByCode(Long id , String code);

    @Query(value ="select max(cast(substring(code, 3,length(code) ) as unsigned ) ) from product where code like 'P%' ", nativeQuery = true)
    Integer findMaxCodeByPrefix();

    @Query("SELECT new com.DATN.Graduation.Project.dto.ProductDto(p.id, p.code, p.name, p.isDeleted, p.isActive, " +
            "p.brand, p.quantity, p.price, p.discount, p.description) FROM ProductEntity p " +
            "where p.id IN :ids and p.isDeleted = false ")
    List<ProductDto> findProduct(List<Long> ids);

//    @Query(value = "select new com.DATN.Graduation.Project.dto.ProductDto(a.id,a.code,a.name,a.isActive,a.isDeleted,a.brand, " +
//            "a.quantity,a.price,a.discount,a.description ) " +
//            "from ProductEntity a " +
//            "where " +
//            "(:#{#dto.code} is null or a.code like concat('%',:#{#dto.code}, '%')) and " +
//            "(:#{#dto.name} is null or :#{#dto.name} = '' or lower(a.name) like concat('%',lower(:#{#dto.name}),'%')) and " +
//            "(:minPrice is null or a.price >= :minPrice) and " +
//            "(:maxPrice is null or a.price <= :maxPrice) and " +
//            "(:#{#dto.brand} is null or a.brand =:#{#dto.brand}) ")
//    List<ProductEntity> lookupProducts(
//            ProductDto dto,
//            @Param("minPrice") BigDecimal minPrice,
//            @Param("maxPrice") BigDecimal maxPrice
//    );
    @Query(value = "select * " +
            "from product a " +
            "where a.code =:code ",nativeQuery = true)
    Optional<ProductEntity> findByCode(String code);

    @Query(value = "select a.name from product a",nativeQuery = true)
    List<String> getProductNames();
}
