package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.entity.StockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<StockEntity,Long> {
    @Query(value = "SELECT * " +
            "FROM stock s " +
            "WHERE s.product = :code AND s.import_date = ( " +
            "    SELECT MIN(import_date) FROM stock WHERE product = :code " +
            ") " +
            "LIMIT 1", nativeQuery = true)
    StockEntity findByProduct(String code);
    @Query("SELECT s FROM StockEntity s WHERE s.product = :product AND s.importPrice = :importPrice")
    Optional<StockEntity> findByProductAndImportPrice(String product, Long importPrice);
}
