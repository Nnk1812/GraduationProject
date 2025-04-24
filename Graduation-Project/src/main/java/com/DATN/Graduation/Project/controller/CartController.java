package com.DATN.Graduation.Project.controller;

import com.DATN.Graduation.Project.dto.CartDto;
import com.DATN.Graduation.Project.dto.CartItemDto;
import com.DATN.Graduation.Project.dto.ShoppingCartDto;
import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/save")
    public ApiResponse<CartItemDto> addCartItem(@RequestBody CartItemDto dto,String user) {
        ApiResponse<CartItemDto> apiResponse = new ApiResponse<>();
        apiResponse.setData(cartService.addCartItem(dto,user));
        return apiResponse;
    }
    @GetMapping("/findAll")
    public ApiResponse<List<ShoppingCartDto>> findAll(@RequestParam String user) {
        ApiResponse<List<ShoppingCartDto>> apiResponse = new ApiResponse<>();
        apiResponse.setData(cartService.findAllShoppingCart(user));
        return apiResponse;
    }
    @PutMapping("/delete")
    public ApiResponse<String> deleteCartItem(@RequestParam String user,@RequestParam String product) {
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setData(cartService.deleteCartItem(user,product));
        return apiResponse;
    }
}
