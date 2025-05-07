package com.DATN.Graduation.Project.controller;

import com.DATN.Graduation.Project.dto.ReportWarrantyDto;
import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.entity.ReportWarrantyEntity;
import com.DATN.Graduation.Project.service.ReportWarrantyService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/warranty")
@RequiredArgsConstructor
public class ReportWarrantyController {
    @Autowired
    private ReportWarrantyService reportWarrantyService;
    @PostMapping("/save")
    public ApiResponse<ReportWarrantyDto> save(@RequestBody ReportWarrantyDto dto) {
        ApiResponse<ReportWarrantyDto> response = new ApiResponse<>();
        response.setData(reportWarrantyService.saveReport(dto));
        return response;
    }
    @GetMapping("/findAll")
    public ApiResponse<List<ReportWarrantyEntity>> findAll() {
        ApiResponse<List<ReportWarrantyEntity>> response = new ApiResponse<>();
        response.setData(reportWarrantyService.findAll());
        return response;
    }
    @GetMapping("/findByUsername")
    public ApiResponse<List<ReportWarrantyEntity>> findByUsername(@RequestParam String username) {
        ApiResponse<List<ReportWarrantyEntity>> response = new ApiResponse<>();
        response.setData(reportWarrantyService.findByUser(username));
        return response;
    }
    @PostMapping("/received")
    public ApiResponse<String> received(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(reportWarrantyService.receive(code));
        return response;
    }
    @PostMapping("/inProgress")
    public ApiResponse<String> inProgress(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(reportWarrantyService.inProgress(code));
        return response;
    }
    @PostMapping("/complete")
    public ApiResponse<String> complete(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(reportWarrantyService.complete(code));
        return response;
    }
    @PostMapping("/returned")
    public ApiResponse<String> returned(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(reportWarrantyService.returned(code));
        return response;
    }
    @PostMapping("/rejected")
    public ApiResponse<String> rejected(@RequestParam String code) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(reportWarrantyService.rejected(code));
        return response;
    }
}
