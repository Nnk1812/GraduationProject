package com.DATN.Graduation.Project.service;

import com.DATN.Graduation.Project.dto.OrderDto;
import com.DATN.Graduation.Project.entity.OrderEntity;

import java.util.List;

public interface OrderService {
    OrderDto saveOrder(OrderDto orderDto);

    OrderDto orderDetail(String code);

    String confirmOrder(String code);
    String transferOrder(String code);
    String delivery(String code);
    String receive(String code);
    String cancel(String code);

    List<OrderEntity> historyOrder();
}
