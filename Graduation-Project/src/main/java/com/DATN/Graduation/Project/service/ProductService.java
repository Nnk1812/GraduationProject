package com.DATN.Graduation.Project.service;

import com.DATN.Graduation.Project.dto.*;
import com.DATN.Graduation.Project.entity.ProductDetailEntity;

import com.DATN.Graduation.Project.entity.ReviewsEntity;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductService {
    ProductDto saveProduct(ProductDto productsDto);

    List<ProductDto> getProductDetails(List<Long> id);

    List<FindProductDto> findAllProducts();

    String deleteProduct(String code);

    String hiddenProduct(String code);

    ReviewsDto reviewProduct(ReviewsDto dto);

    RatingDto ratingProduct(String code);

    List<ReviewsEntity> findAllReviewsByProduct(String code);

    List<FindProductDto> findOutstandingProduct(Pageable pageable);

    ProductDetailEntity getProductDetail(String code);

    List<FindProductDto> findByBrand(String brand);

    List<FindAllProductDto> findAll();

    FindProductDetailDto findProductDetail(String code);

    List<FindProductDto> findByName(String productName);

    String activeProduct(String code);

    List<String> findAllNameProducts();
}

