package com.DATN.Graduation.Project.controller;

import com.DATN.Graduation.Project.dto.DiscountDto;
import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.entity.DiscountEntity;
import com.DATN.Graduation.Project.service.DiscountService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/discount")
@RequiredArgsConstructor
public class DiscountController {
    @Autowired
    private final DiscountService discountService;
    @PostMapping("/save")
    public ApiResponse<DiscountEntity> saveDiscount(@RequestBody DiscountDto discountDto) {
        ApiResponse<DiscountEntity> response = new ApiResponse<>();
        response.setData(discountService.saveDiscount(discountDto));
        return response;
    }
    @GetMapping("/findAll")
    public ApiResponse<List<DiscountEntity>> findAllDiscount() {
        ApiResponse<List<DiscountEntity>> response = new ApiResponse<>();
        response.setData(discountService.findAll());
        return response;
    }
    @PostMapping("/hidden")
    public ApiResponse<String> hiddenDiscount(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(discountService.hiddenDiscount(code));
        return response;
    }
    @PutMapping("/delete")
    public ApiResponse<String> deleteDiscount(@RequestParam Long id) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(discountService.deleteDiscount(id));
        return response;
    }
    @PostMapping("/active")
    public ApiResponse<String> activeDiscount(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(discountService.activateDiscount(code));
        return response;
    }
    @GetMapping("/detail")
    public ApiResponse<DiscountEntity> getDetail(@RequestParam String code) {
        ApiResponse<DiscountEntity> response = new ApiResponse<>();
        response.setData(discountService.getDetail(code));
        return response;
    }
    @GetMapping("/findAllDiscountValid")
    public ApiResponse<List<DiscountEntity>> findAllDiscountValid() {
        ApiResponse<List<DiscountEntity>> response = new ApiResponse<>();
        response.setData(discountService.findAllIsDiscountValid());
        return response;
    }
}
