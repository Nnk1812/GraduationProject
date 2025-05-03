package com.DATN.Graduation.Project.controller;

import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.entity.StockEntity;
import com.DATN.Graduation.Project.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/stock")
@RequiredArgsConstructor
public class StockController {
    @Autowired
    private StockService stockService;

    @GetMapping("/findAll")
    public ApiResponse<List<StockEntity>> findAll(){
        ApiResponse<List<StockEntity>> apiResponse = new ApiResponse<>();
        apiResponse.setData(stockService.findAll());
        return apiResponse;
    }
}
