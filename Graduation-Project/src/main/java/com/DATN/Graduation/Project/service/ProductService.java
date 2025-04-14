package com.DATN.Graduation.Project.service;

import com.DATN.Graduation.Project.dto.ProductDto;
import com.DATN.Graduation.Project.dto.RatingDto;
import com.DATN.Graduation.Project.dto.ReviewsDto;
import com.DATN.Graduation.Project.entity.ProductEntity;

import java.util.List;

public interface ProductService {
    ProductDto saveProduct(ProductDto productsDto);

    List<ProductDto> getProductDetails(List<Long> id);

    List<ProductEntity> findAllProducts();

    String deleteProduct(Long id);

    String hiddenProduct(Long id);

//    List<ProductsEntity> lookupProducts();

    ReviewsDto reviewProduct(ReviewsDto dto);

    RatingDto ratingProduct(String code);
}
