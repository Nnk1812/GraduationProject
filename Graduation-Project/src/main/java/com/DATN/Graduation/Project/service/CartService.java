package com.DATN.Graduation.Project.service;

import com.DATN.Graduation.Project.dto.CartDto;
import com.DATN.Graduation.Project.dto.CartItemDto;

public interface CartService {
    CartItemDto addCartItem(CartItemDto dto);
}
