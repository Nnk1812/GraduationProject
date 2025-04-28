package com.DATN.Graduation.Project.controller;

import com.DATN.Graduation.Project.dto.ReportImportWarehouseDto;
import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.service.ReportImportWarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
