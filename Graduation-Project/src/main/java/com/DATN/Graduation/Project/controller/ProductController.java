package com.DATN.Graduation.Project.controller;

import com.DATN.Graduation.Project.dto.*;
import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.entity.ProductDetailEntity;
import com.DATN.Graduation.Project.entity.ProductEntity;
import com.DATN.Graduation.Project.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;
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
    public ApiResponse<String> deleteProduct(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(productsService.deleteProduct(code));
        return response;
    }
    @PostMapping("/hidden")
    public ApiResponse<String> hiddenProduct(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(productsService.hiddenProduct(code));
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
    public ApiResponse<List<FindOutStandingDto>> ratingProduct() {
        ApiResponse<List<FindOutStandingDto>> response = new ApiResponse<>();
        response.setData(productsService.findAllProducts());
        return response;
    }
    @GetMapping("/findOutstanding")
    public ApiResponse<List<FindOutStandingDto>> findOutstandingProduct(@PageableDefault(page = 0, size = 4) Pageable pageable) {
        ApiResponse<List<FindOutStandingDto>> response = new ApiResponse<>();
        response.setData(productsService.findOutstandingProduct(pageable));
        return response;
    }
    @GetMapping("/productDetail")
    public ApiResponse<ProductDetailEntity> getProductDetail(@RequestParam String code) {
        ApiResponse<ProductDetailEntity> response = new ApiResponse<>();
        response.setData(productsService.getProductDetail(code));
        return response;
    }
    @GetMapping("/findByBrand")
    public ApiResponse<List<FindOutStandingDto>> findByBrand(@RequestParam String brand) {
        ApiResponse<List<FindOutStandingDto>> response = new ApiResponse<>();
        response.setData(productsService.findByBrand(brand));
        return response;
    }
    @GetMapping("/getAll")
    public ApiResponse<List<FindAllProductDto>> findAll() {
        ApiResponse<List<FindAllProductDto>> response = new ApiResponse<>();
        response.setData(productsService.findAll());
        return response;
    }
    @GetMapping("/getDetail")
    public ApiResponse<FindProductDetailDto> findProductDetail(@RequestParam String code) {
        ApiResponse<FindProductDetailDto> response = new ApiResponse<>();
        response.setData(productsService.findProductDetail(code));
        return response;
    }
    @GetMapping("/findByName")
    public ApiResponse<List<FindOutStandingDto>> findByName(@RequestParam String name) {
        ApiResponse<List<FindOutStandingDto>> response = new ApiResponse<>();
        response.setData(productsService.findByName(name));
        return response;
    }
    @PostMapping("/active")
    public ApiResponse<String> activeProduct(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(productsService.activeProduct(code));
        return response;
    }
}
