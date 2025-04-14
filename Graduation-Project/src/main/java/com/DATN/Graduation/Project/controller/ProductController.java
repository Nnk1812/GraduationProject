package com.DATN.Graduation.Project.controller;

import com.DATN.Graduation.Project.dto.ProductDto;
import com.DATN.Graduation.Project.dto.RatingDto;
import com.DATN.Graduation.Project.dto.ReviewsDto;
import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.entity.ProductEntity;
import com.DATN.Graduation.Project.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    @Autowired
    private final ProductService productsService;

    @PostMapping("/save")
    public ApiResponse<ProductDto> saveProduct(@RequestBody ProductDto productsDto) {
        ApiResponse<ProductDto> response = new ApiResponse<>();
        response.setData(productsService.saveProduct(productsDto));
        return response;
    }
    @GetMapping("/detail")
    public ApiResponse<List<ProductDto>> detailProduct(@RequestParam List<Long> ids) {
        ApiResponse<List<ProductDto>> response = new ApiResponse<>();
        response.setData(productsService.getProductDetails(ids));
        return response;
    }
    @PutMapping("/delete")
    public ApiResponse<String> deleteProduct(@RequestParam Long id) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(productsService.deleteProduct(id));
        return response;
    }
    @PostMapping("/hidden")
    public ApiResponse<String> hiddenProduct(@RequestParam Long id) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(productsService.hiddenProduct(id));
        return response;
    }
    @PostMapping("/review")
    public ApiResponse<ReviewsDto> reviewProduct(@RequestBody ReviewsDto dto) {
        ApiResponse<ReviewsDto> response = new ApiResponse<>();
        response.setData(productsService.reviewProduct(dto));
        return response;
    }
    @GetMapping("/rating")
    public ApiResponse<RatingDto> ratingProduct(@RequestParam String code) {
        ApiResponse<RatingDto> response = new ApiResponse<>();
        response.setData(productsService.ratingProduct(code));
        return response;
    }
    @GetMapping("findAll")
    public ApiResponse<List<ProductEntity>> ratingProduct() {
        ApiResponse<List<ProductEntity>> response = new ApiResponse<>();
        response.setData(productsService.findAllProducts());
        return response;
    }
}
