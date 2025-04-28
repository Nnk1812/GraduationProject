package com.DATN.Graduation.Project.service;

import com.DATN.Graduation.Project.dto.CartDto;
import com.DATN.Graduation.Project.dto.CartItemDto;
import com.DATN.Graduation.Project.dto.ShoppingCartDto;

import java.util.List;

public interface CartService {
    CartItemDto addCartItem(CartItemDto dto,String user);

    List<ShoppingCartDto> findAllShoppingCart( String user);

    String deleteCartItem(String user,String product);

    String clearCart(String user);
}
