package com.DATN.Graduation.Project.controller;

import com.DATN.Graduation.Project.dto.BrandDto;
import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.entity.BrandEntity;
import com.DATN.Graduation.Project.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/brand")
@RequiredArgsConstructor
public class BrandController {
    @Autowired
    private final BrandService brandService;

    @PostMapping("/save")
    public ApiResponse<BrandEntity> saveBrand(@RequestBody BrandDto dto) {
        ApiResponse<BrandEntity> response = new ApiResponse<>();
        response.setData(brandService.saveBrand(dto));
        return response;
    }

    @PostMapping("/hidden")
    public ApiResponse<String> saveBrand(@RequestParam Long id) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(brandService.hiddenBrand(id));
        return response;
    }

    @GetMapping("/findAll")
    public ApiResponse<List<BrandEntity>> findAll() {
        ApiResponse<List<BrandEntity>> response = new ApiResponse<>();
        response.setData(brandService.findAll());
        return response;
    }

    @PutMapping("/delete")
    public ApiResponse<String> deleteBrand(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(brandService.deleteBrand(code));
        return response;
    }

    @GetMapping("/detail")
    public ApiResponse<BrandEntity> findAll(@RequestParam String code) {
        ApiResponse<BrandEntity> response = new ApiResponse<>();
        response.setData(brandService.getDetail(code));
        return response;
    }
    @GetMapping("/findName")
    public ApiResponse<String> findBrandByCode(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(brandService.findBrandByCode(code));
        return response;
    }
}
