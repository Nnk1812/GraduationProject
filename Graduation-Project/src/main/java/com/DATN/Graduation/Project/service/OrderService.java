package com.DATN.Graduation.Project.service;

import com.DATN.Graduation.Project.dto.MonthlyIncomeDto;
import com.DATN.Graduation.Project.dto.OrderDto;
import com.DATN.Graduation.Project.dto.StatisticalDto;
import com.DATN.Graduation.Project.dto.StatisticalReviewDto;
import com.DATN.Graduation.Project.entity.OrderEntity;

import javax.xml.crypto.Data;
import java.util.Date;
import java.util.List;

public interface OrderService {
    OrderDto saveOrder(OrderDto dto);

    OrderDto orderDetail(String code);

    String confirmOrder(String code,String user);
    String transferOrder(String code);
    String delivery(String code);
    String receive(String code);
    String cancel(String code);
    String returnProduct(String code);
    String confirm(String code);
    String returnProductToStock(String code);
    List<OrderEntity> historyOrder();

    List<OrderDto> userOrder(String code);

    StatisticalDto findAllStatistical();
    StatisticalDto findByDate(Date startDate, Date endDate);
    List<MonthlyIncomeDto> getMonthlyIncomeByYear(int year);
    StatisticalReviewDto getStatisticalReview();
}
