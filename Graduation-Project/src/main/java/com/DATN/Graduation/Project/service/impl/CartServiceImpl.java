package com.DATN.Graduation.Project.service.impl;

import com.DATN.Graduation.Project.dto.CartItemDto;
import com.DATN.Graduation.Project.dto.ShoppingCartDto;
import com.DATN.Graduation.Project.entity.*;
import com.DATN.Graduation.Project.exception.AppException;
import com.DATN.Graduation.Project.exception.ErrorCode;
import com.DATN.Graduation.Project.repository.*;
import com.DATN.Graduation.Project.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ProductRepository productsRepository;
    @Autowired
    private DiscountRepository discountRepository;

    @Override
    public CartItemDto addCartItem(CartItemDto dto,String user) {
        // Tìm sản phẩm trong DB theo mã
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        ProductEntity entity = productsRepository.findByCode(dto.getProduct())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        Optional<CartItemEntity> existingItemOpt = cartItemRepository.findByProduct(dto.getProduct(),user);

        CartItemEntity cartItemEntity;

        if (existingItemOpt.isPresent()) {
            // Nếu đã có thì cập nhật
            cartItemEntity = existingItemOpt.get();
            cartItemEntity.setQuantity(dto.getQuantity());
            cartItemEntity.setPricePreDiscount(entity.getPrice() * dto.getQuantity());
            cartItemEntity.setTotalPrice(entity.getRealPrice() * dto.getQuantity());
        } else {
            // Nếu chưa có thì tạo mới
            cartItemEntity = new CartItemEntity();
            cartItemEntity.setProduct(dto.getProduct());
            cartItemEntity.setUser(user);
            cartItemEntity.setName(entity.getName());
            cartItemEntity.setPrice(entity.getPrice());
            cartItemEntity.setDiscount(entity.getDiscount());
            cartItemEntity.setRealPrice(entity.getRealPrice());
            cartItemEntity.setQuantity(dto.getQuantity());
            cartItemEntity.setPricePreDiscount(entity.getPrice() * dto.getQuantity());
            cartItemEntity.setTotalPrice(entity.getRealPrice() * dto.getQuantity());
        }

        // Lưu lại (dù là update hay insert)
        CartItemEntity saved = cartItemRepository.save(cartItemEntity);

        // Trả kết quả
        return modelMapper.map(saved, CartItemDto.class);
    }
    @Override
    public List<ShoppingCartDto> findAllShoppingCart(String user){
        return cartItemRepository.findAllProductInCart(user);
    }
    @Override
    public String deleteCartItem(String user,String product){
        CartItemEntity entity = cartItemRepository.findByUserAndProduct(user,product).orElseThrow(
                () -> new AppException(ErrorCode.CART_NOT_EXISTED)
        );
        cartItemRepository.delete(entity);
        return "success";
    }

    @Override
    public String clearCart(String user){
        List<CartItemEntity> entities = cartItemRepository.findAllProductsByUser(user);
        cartItemRepository.deleteAll(entities);
        return "success";
    }


}
