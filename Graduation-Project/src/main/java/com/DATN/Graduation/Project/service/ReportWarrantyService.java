package com.DATN.Graduation.Project.service;

import com.DATN.Graduation.Project.dto.ReportWarrantyDto;
import com.DATN.Graduation.Project.entity.ReportWarrantyEntity;

import java.util.List;

public interface ReportWarrantyService {
    ReportWarrantyDto saveReport(ReportWarrantyDto reportWarrantyDto);
    String receive(String code);
    String inProgress(String code);
    String complete(String code);
    String returned(String code);
    String rejected(String code);
    List<ReportWarrantyEntity> findAll();
    List<ReportWarrantyEntity> findByUser(String username);
}
