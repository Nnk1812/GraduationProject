package com.DATN.Graduation.Project.controller;

import com.DATN.Graduation.Project.dto.CartDto;
import com.DATN.Graduation.Project.dto.CartItemDto;
import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/addCartItem")
    public ApiResponse<CartItemDto> addCartItem(@RequestBody CartItemDto dto) {
        ApiResponse<CartItemDto> apiResponse = new ApiResponse<>();
        apiResponse.setData(cartService.addCartItem(dto));
        return apiResponse;
    }
}
