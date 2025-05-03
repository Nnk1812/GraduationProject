package com.DATN.Graduation.Project.controller;

import com.DATN.Graduation.Project.dto.ReportImportWarehouseDto;
import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.entity.ReportImportWarehouseEntity;
import com.DATN.Graduation.Project.service.ReportImportWarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/warehouse")
@RequiredArgsConstructor
public class ReportImportWarehouseController {
    @Autowired
    private ReportImportWarehouseService reportImportWarehouseService;
    @PostMapping("/save")
    public ApiResponse<ReportImportWarehouseDto> saveWarehouse(@RequestBody ReportImportWarehouseDto reportImportWarehouseDto) {
        ApiResponse<ReportImportWarehouseDto> apiResponse = new ApiResponse<>();
        apiResponse.setData(reportImportWarehouseService.saveWarehouse(reportImportWarehouseDto));
        return apiResponse;
    }
    @GetMapping("/findAll")
    public ApiResponse<List<ReportImportWarehouseEntity>> findAll() {
        ApiResponse<List<ReportImportWarehouseEntity>> apiResponse = new ApiResponse<>();
        apiResponse.setData(reportImportWarehouseService.findAllReportImportWarehouse());
        return apiResponse;
    }
    @GetMapping("/detail")
    public ApiResponse<ReportImportWarehouseDto> findDetail(@RequestParam String code) {
        ApiResponse<ReportImportWarehouseDto> apiResponse = new ApiResponse<>();
        apiResponse.setData(reportImportWarehouseService.findReportImportWarehouseDetail(code));
        return apiResponse;
    }
}
