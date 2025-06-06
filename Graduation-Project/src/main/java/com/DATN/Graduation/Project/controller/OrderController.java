package com.DATN.Graduation.Project.controller;

import com.DATN.Graduation.Project.dto.MonthlyIncomeDto;
import com.DATN.Graduation.Project.dto.OrderDto;
import com.DATN.Graduation.Project.dto.StatisticalDto;
import com.DATN.Graduation.Project.dto.StatisticalReviewDto;
import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.entity.OrderEntity;
import com.DATN.Graduation.Project.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
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
    @PostMapping("/confirmOrder")
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
    @PostMapping("/confirm")
    public ApiResponse<String> confirm(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(orderService.confirm(code));
        return response;
    }
    @PostMapping("/cancel")
    public ApiResponse<String> cancel(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(orderService.cancel(code));
        return response;
    }
    @PostMapping("/return")
    public ApiResponse<String> review(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(orderService.returnProduct(code));
        return response;
    }
    @PostMapping("/returnToStock")
    public ApiResponse<String> returnToStock(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(orderService.returnProductToStock(code));
        return response;
    }
    @GetMapping("/findByCode")
    public ApiResponse<List<OrderDto>> userOrder(@RequestParam String code) {
        ApiResponse<List<OrderDto>> response = new ApiResponse<>();
        response.setData(orderService.userOrder(code));
        return response;
    }
    @GetMapping("/findStatistical")
    public ApiResponse<StatisticalDto> findStatistical() {
        ApiResponse<StatisticalDto> response = new ApiResponse<>();
        response.setData(orderService.findAllStatistical());
        return response;
    }
    @GetMapping("/findByDate")
    public ApiResponse<StatisticalDto> findByDate(
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate
    ) {
        ApiResponse<StatisticalDto> response = new ApiResponse<>();
        response.setData(orderService.findByDate(startDate,endDate));
        return response;
    }
    @GetMapping("/monthlyIncome")
    public ApiResponse<List<MonthlyIncomeDto>> findStatistical(@RequestParam Integer year) {
        ApiResponse<List<MonthlyIncomeDto>> response = new ApiResponse<>();
        response.setData(orderService.getMonthlyIncomeByYear(year));
        return response;
    }
    @GetMapping("/statisticalReview")
    public ApiResponse<StatisticalReviewDto> StatisticalReview() {
        ApiResponse<StatisticalReviewDto> response = new ApiResponse<>();
        response.setData(orderService.getStatisticalReview());
        return response;
    }
}

