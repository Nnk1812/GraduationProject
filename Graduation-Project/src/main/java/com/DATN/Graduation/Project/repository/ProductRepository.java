package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.dto.FindAllProductDto;
import com.DATN.Graduation.Project.dto.FindProductDto;
import com.DATN.Graduation.Project.dto.FindProductDetailDto;
import com.DATN.Graduation.Project.dto.ProductDto;
import com.DATN.Graduation.Project.entity.ProductEntity;
import com.DATN.Graduation.Project.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

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
            "p.brand, p.price, p.discount, p.description ,p.image,p.warrantyMonths) FROM ProductEntity p " +
            "where p.id IN :ids and p.isDeleted = false ")
    List<ProductDto> findProduct(List<Long> ids);

    @Query(value = "select a.code from product a",nativeQuery = true)
    List<String> findAllProductCode();

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


    @Query(value = """
    SELECT new com.DATN.Graduation.Project.dto.FindProductDto(
        a.name, a.price, a.realPrice, d.value, a.image, a.description, a.code, a.type, a.brand, f.quantity)
    FROM ProductEntity a
    LEFT JOIN OrderDetailEntity b ON a.code = b.product
    LEFT JOIN OrderEntity c ON c.code = b.orderCode
    LEFT JOIN DiscountEntity d ON a.discount = d.code
    LEFT JOIN BrandEntity e ON e.code = a.brand
    INNER JOIN StockEntity f ON f.id = (
        SELECT f2.id
        FROM StockEntity f2
        WHERE f2.product = a.code
        ORDER BY f2.importDate ASC
        LIMIT 1
    )
    WHERE f.quantity > 0 and a.isDeleted = false
    GROUP BY a.name, a.price, a.realPrice, d.value, a.image, a.description, a.code, a.type, a.brand, f.quantity
    ORDER BY SUM(b.quantity) DESC
    """)
    List<FindProductDto> findTopFourByQuantity(Pageable pageable);


    @Query(value = """
    SELECT new com.DATN.Graduation.Project.dto.FindProductDto(
        a.name, a.price, a.realPrice, d.value, a.image, a.description, a.code, a.type, a.brand, f.quantity)
    FROM ProductEntity a
    LEFT JOIN OrderDetailEntity b ON a.code = b.product
    LEFT JOIN OrderEntity c ON c.code = b.orderCode
    LEFT JOIN DiscountEntity d ON a.discount = d.code
    LEFT JOIN BrandEntity e ON e.code = a.brand
    INNER JOIN StockEntity f ON f.id = (
        SELECT f2.id
        FROM StockEntity f2
        WHERE f2.product = a.code
        ORDER BY f2.importDate ASC
        LIMIT 1
    )
    WHERE f.quantity > 0 and a.isDeleted = false
    GROUP BY a.name, a.price, a.realPrice, d.value, a.image, a.description, a.code, a.type, a.brand, f.quantity
    """)
    List<FindProductDto> findAllProduct();

    @Query(value = """
    SELECT new com.DATN.Graduation.Project.dto.FindProductDto(
        a.name, a.price, a.realPrice, d.value, a.image, a.description, a.code, a.type, a.brand, f.quantity)
    FROM ProductEntity a
    LEFT JOIN OrderDetailEntity b ON a.code = b.product
    LEFT JOIN OrderEntity c ON c.code = b.orderCode
    LEFT JOIN DiscountEntity d ON a.discount = d.code
    LEFT JOIN BrandEntity e ON e.code = a.brand
    INNER JOIN StockEntity f ON f.id = (
        SELECT f2.id
        FROM StockEntity f2
        WHERE f2.product = a.code
        ORDER BY f2.importDate ASC
        LIMIT 1
    )
    WHERE f.quantity > 0 and e.name =:brand and a.isDeleted = false
    GROUP BY a.name, a.price, a.realPrice, d.value, a.image, a.description, a.code, a.type, a.brand, f.quantity
    """)
    List<FindProductDto> findByBrand(String brand);

    @Query("select new com.DATN.Graduation.Project.dto.FindAllProductDto(a.code,a.name,a.type,b.code,b.name,c.code,c.name,a.price,a.realPrice,a.isDeleted) " +
            "from ProductEntity a " +
            "inner join BrandEntity b on a.brand = b.code " +
            "left join DiscountEntity c on c.code = a.discount " )
    List<FindAllProductDto> findAllProducts();

    @Query("select new com.DATN.Graduation.Project.dto.FindProductDetailDto(a.id,a.code,a.name,a.type,b.code,b.name,c.code,c.name,a.price,a.realPrice,a.image,a.description,d.material,d.strapMaterial,d.movementType,d.waterResistance,d.dialSize,d.origin) " +
            "from ProductEntity a " +
            "inner join BrandEntity b on a.brand = b.code " +
            "left join DiscountEntity c on c.code = a.discount " +
            "inner join ProductDetailEntity d on d.product = a.code " +
            "where a.isDeleted = false and a.code =:code ")
    FindProductDetailDto findAllProductsDetail(String code);
    @Query("SELECT new com.DATN.Graduation.Project.dto.FindProductDto(a.name, a.price, a.realPrice, d.value, a.image, a.description, a.code, a.type, a.brand,f.quantity) " +
            "FROM ProductEntity a " +
            "LEFT JOIN OrderDetailEntity b ON a.code = b.product " +
            "LEFT JOIN OrderEntity c ON c.code = b.orderCode " +
            "LEFT JOIN DiscountEntity d ON a.discount = d.code " +
            "LEFT JOIN BrandEntity e ON e.code = a.brand " +
            "inner join StockEntity f on f.id =( " +
            "select f2.id " +
            "from StockEntity f2 " +
            "where f2.product = a.code " +
            "order by  f2.importDate asc " +
            "limit 1) " +
            "WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%')) and f.quantity >0 and a.isDeleted = false " +
            "GROUP BY a.name, a.price, a.realPrice, d.value, a.image, a.description, a.code, a.type, a.brand,f.quantity")
    List<FindProductDto> searchByProductNameCustom(String name);

    @Query(value = "SELECT DISTINCT a.name FROM product a " +
            "WHERE a.is_deleted = false AND EXISTS (" +
            "   SELECT 1 FROM stock b2 " +
            "   WHERE b2.product = a.code AND b2.quantity > 0 " +
            ")", nativeQuery = true)
    List<String> findAllProductNames();

    @Query(value = "SELECT p.* " +
            "FROM product p " +
            "JOIN order_detail a ON a.product = p.code " +
            "JOIN orders b ON a.order_code =b.code " +
            "WHERE p.code = :code",nativeQuery = true)
    List<ProductEntity> findProductInOrder(String code);
}
