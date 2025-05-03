package com.DATN.Graduation.Project.service;

import com.DATN.Graduation.Project.dto.ReportImportWarehouseDto;
import com.DATN.Graduation.Project.entity.ReportImportWarehouseEntity;

import java.util.List;

public interface ReportImportWarehouseService {
    ReportImportWarehouseDto saveWarehouse(ReportImportWarehouseDto dto);

    List<ReportImportWarehouseEntity> findAllReportImportWarehouse();

    ReportImportWarehouseDto findReportImportWarehouseDetail(String code);
}
