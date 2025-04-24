package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.dto.FindAllProductDto;
import com.DATN.Graduation.Project.dto.FindOutStandingDto;
import com.DATN.Graduation.Project.dto.FindProductDetailDto;
import com.DATN.Graduation.Project.dto.ProductDto;
import com.DATN.Graduation.Project.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
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
            "p.brand, p.price, p.discount, p.description ,p.image) FROM ProductEntity p " +
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


    @Query("SELECT new com.DATN.Graduation.Project.dto.FindOutStandingDto(a.name, a.price, a.realPrice, d.value, a.image,a.description,a.code,a.type,a.brand) " +
            "FROM ProductEntity a " +
            "LEFT JOIN OrderDetailEntity b ON a.code = b.product " +
            "LEFT JOIN OrderEntity c ON c.code = b.orderCode " +
            "LEFT JOIN DiscountEntity d ON a.discount = d.code " +
            "LEFT JOIN BrandEntity e on e.code = a.brand " +
            "GROUP BY a.name, a.price, a.realPrice, d.value, a.image,a.description,a.code,a.type,a.brand " +
            "ORDER BY SUM(b.quantity) DESC")
    List<FindOutStandingDto> findTopFourByQuantity(Pageable pageable);

    @Query("SELECT new com.DATN.Graduation.Project.dto.FindOutStandingDto(a.name, a.price, a.realPrice, d.value, a.image,a.description,a.code,a.type,a.brand) " +
            "FROM ProductEntity a " +
            "LEFT JOIN OrderDetailEntity b ON a.code = b.product " +
            "LEFT JOIN OrderEntity c ON c.code = b.orderCode " +
            "LEFT JOIN DiscountEntity d ON a.discount = d.code " +
            "LEFT JOIN BrandEntity e on e.code = a.brand " +
            "GROUP BY a.name, a.price, a.realPrice, d.value, a.image,a.description,a.code,a.type,a.brand " )
    List<FindOutStandingDto> findAllProduct();

    @Query("SELECT new com.DATN.Graduation.Project.dto.FindOutStandingDto(a.name, a.price, a.realPrice, d.value, a.image,a.description,a.code,a.type,a.brand) " +
            "FROM ProductEntity a " +
            "LEFT JOIN OrderDetailEntity b ON a.code = b.product " +
            "LEFT JOIN OrderEntity c ON c.code = b.orderCode " +
            "LEFT JOIN DiscountEntity d ON a.discount = d.code " +
            "LEFT JOIN BrandEntity e on e.code = a.brand " +
            "WHERE e.name =:brand " +
            "GROUP BY a.name, a.price, a.realPrice, d.value, a.image,a.description,a.code,a.type,a.brand " )
    List<FindOutStandingDto> findByBrand(String brand);

    @Query("select new com.DATN.Graduation.Project.dto.FindAllProductDto(a.code,a.name,a.type,b.code,b.name,c.code,c.name,a.price,a.realPrice) " +
            "from ProductEntity a " +
            "inner join BrandEntity b on a.brand = b.code " +
            "left join DiscountEntity c on c.code = a.discount " +
            "where a.isDeleted = false ")
    List<FindAllProductDto> findAllProducts();

    @Query("select new com.DATN.Graduation.Project.dto.FindProductDetailDto(a.id,a.code,a.name,a.type,b.code,b.name,c.code,c.name,a.price,a.realPrice,a.image,a.description,d.material,d.strapMaterial,d.movementType,d.waterResistance,d.dialSize,d.origin) " +
            "from ProductEntity a " +
            "inner join BrandEntity b on a.brand = b.code " +
            "inner join DiscountEntity c on c.code = a.discount " +
            "inner join ProductDetailEntity d on d.product = a.code " +
            "where a.isDeleted = false and a.code =:code ")
    FindProductDetailDto findAllProductsDetail(String code);
    @Query("SELECT new com.DATN.Graduation.Project.dto.FindOutStandingDto(a.name, a.price, a.realPrice, d.value, a.image, a.description, a.code, a.type, a.brand) " +
            "FROM ProductEntity a " +
            "LEFT JOIN OrderDetailEntity b ON a.code = b.product " +
            "LEFT JOIN OrderEntity c ON c.code = b.orderCode " +
            "LEFT JOIN DiscountEntity d ON a.discount = d.code " +
            "LEFT JOIN BrandEntity e ON e.code = a.brand " +
            "WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "GROUP BY a.name, a.price, a.realPrice, d.value, a.image, a.description, a.code, a.type, a.brand")
    List<FindOutStandingDto> findByProductNameIgnoreCase(String name);

}
