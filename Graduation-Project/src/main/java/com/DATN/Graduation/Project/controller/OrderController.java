package com.DATN.Graduation.Project.controller;

import com.DATN.Graduation.Project.dto.OrderDto;
import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.entity.OrderEntity;
import com.DATN.Graduation.Project.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/save")
    public ApiResponse<OrderDto> saveOrder(@RequestBody OrderDto orderDto) {
        ApiResponse<OrderDto> response = new ApiResponse<>();
        response.setData(orderService.saveOrder(orderDto));
        return response;
    }
    @GetMapping("/detail")
    public ApiResponse<OrderDto> orderDetail(@RequestParam String code) {
        ApiResponse<OrderDto> response = new ApiResponse<>();
        response.setData(orderService.orderDetail(code));
        return response;
    }
    @GetMapping("/findAll")
    public ApiResponse<List<OrderEntity>> orderHistory() {
        ApiResponse<List<OrderEntity>> response = new ApiResponse<>();
        response.setData(orderService.historyOrder());
        return response;
    }
    @PostMapping("/confirm")
    public ApiResponse<String> confirmOrder(@RequestParam String code,@RequestParam String user) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(orderService.confirmOrder(code,user));
        return response;
    }
    @PostMapping("/transfer")
    public ApiResponse<String> transferOrder(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(orderService.transferOrder(code));
        return response;
    }
    @PostMapping("/delivery")
    public ApiResponse<String> delivery(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(orderService.delivery(code));
        return response;
    }
    @PostMapping("/receive")
    public ApiResponse<String> receive(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(orderService.receive(code));
        return response;
    }
    @PostMapping("/cancel")
    public ApiResponse<String> cancel(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(orderService.cancel(code));
        return response;
    }
    @GetMapping("/findByCode")
    public ApiResponse<List<OrderDto>> userOrder(@RequestParam String code) {
        ApiResponse<List<OrderDto>> response = new ApiResponse<>();
        response.setData(orderService.userOrder(code));
        return response;
    }
}

