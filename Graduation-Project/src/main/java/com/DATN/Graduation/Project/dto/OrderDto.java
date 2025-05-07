package com.DATN.Graduation.Project.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class OrderDto {
    private Long id;
    private String code;
    private String employee;
    private String customer;
    private String userNameCustomer;
    private Integer status;
    private Long totalPrice;
    private String discount;
    private Long realPrice;
    private String paymentMethod;
    private Long priceToPay;
    private Integer paymentStatus;
    private String address;
    private String phone;
    private Long shippingFee;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long deposit;

    // Optional: Thêm danh sách chi tiết đơn hàng nếu cần
    private List<OrderDetailDto> orderDetails;

    public OrderDto(Long id, String code, String employee, String customer, Integer status,
                    Long totalPrice, String discount, Long realPrice, String paymentMethod,
                    Long priceToPay, Integer paymentStatus, String address, String phone, Long shippingFee,
                    String note, LocalDateTime createdAt, LocalDateTime updatedAt,String userNameCustomer,Long deposit) {
        this.id = id;
        this.code = code;
        this.employee = employee;
        this.customer = customer;
        this.status = status;
        this.totalPrice = totalPrice;
        this.discount = discount;
        this.realPrice = realPrice;
        this.paymentMethod = paymentMethod;
        this.priceToPay = priceToPay;
        this.paymentStatus = paymentStatus;
        this.address = address;
        this.phone = phone;
        this.shippingFee = shippingFee;
        this.note = note;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userNameCustomer = userNameCustomer;
        this.deposit = deposit;
    }
}
