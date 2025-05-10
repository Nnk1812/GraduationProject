package com.DATN.Graduation.Project.service.impl;

import com.DATN.Graduation.Project.constant.enums.OrderStatusEnum;
import com.DATN.Graduation.Project.constant.enums.StatusWarranty;
import com.DATN.Graduation.Project.dto.ReportWarrantyDto;
import com.DATN.Graduation.Project.dto.WarrantyDetailDto;
import com.DATN.Graduation.Project.dto.WarrantyDto;
import com.DATN.Graduation.Project.entity.OrderEntity;
import com.DATN.Graduation.Project.entity.ProductEntity;
import com.DATN.Graduation.Project.entity.ReportWarrantyEntity;
import com.DATN.Graduation.Project.entity.UserEntity;
import com.DATN.Graduation.Project.exception.AppException;
import com.DATN.Graduation.Project.exception.ErrorCode;
import com.DATN.Graduation.Project.repository.OrderRepository;
import com.DATN.Graduation.Project.repository.ProductRepository;
import com.DATN.Graduation.Project.repository.ReportWarrantyRepository;
import com.DATN.Graduation.Project.repository.UserRepository;
import com.DATN.Graduation.Project.service.ReportWarrantyService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportWarrantyServiceImpl implements ReportWarrantyService {
    @Autowired
    private final ReportWarrantyRepository reportWarrantyRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;

    @Override
    @Transactional
    public ReportWarrantyDto saveReport(ReportWarrantyDto dto){
        if (!ObjectUtils.isEmpty(dto.getCode())) {
            if (!ObjectUtils.isEmpty(reportWarrantyRepository.findByCode(dto.getId(), dto.getCode()))) {
                throw new AppException(ErrorCode.PRODUCT_EXISTED);
            }
        }
        ReportWarrantyEntity warrantyEntity;
        if (ObjectUtils.isEmpty(dto.getId())) {
            warrantyEntity = new ReportWarrantyEntity();
            if (ObjectUtils.isEmpty(dto.getCode())) {
                dto.setCode(generateNextCode());
            }
        } else {
            warrantyEntity = reportWarrantyRepository.findById(dto.getId()).orElse(null);
            if (ObjectUtils.isEmpty(warrantyEntity)) {
                throw new AppException(ErrorCode.REPORT_WARRANTY_NOT_EXISTED);
            }
        }
        if(ObjectUtils.isEmpty(dto.getOrder())){
            throw new AppException(ErrorCode.REPORT_WARRANTY_MUST_BE_IN_ORDER);
        }else {
            if (!orderRepository.findAllCodes().contains(dto.getOrder())) {
                throw new AppException(ErrorCode.ORDER_NOT_EXISTED);
            }
            if(ObjectUtils.isEmpty(orderRepository.findOrdersByCodeCustomer(dto.getCustomer())))
            {
                throw new AppException(ErrorCode.ORDER_NOT_EXISTED);
            }
        }
        if(ObjectUtils.isEmpty(dto.getProduct())){
            throw new AppException(ErrorCode.REPORT_MUST_HAVE_PRODUCT);
        }else{
            if(!productRepository.findAllProductCode().contains(dto.getProduct())){
                throw new AppException(ErrorCode.PRODUCT_NOT_EXISTED);
            }
            OrderEntity order = orderRepository.findByCode(dto.getOrder()).orElseThrow(
                    () -> new AppException(ErrorCode.ORDER_NOT_EXISTED)
            );
            if(ObjectUtils.isEmpty(orderRepository.findOrdersCustomer(dto.getCustomer(),dto.getProduct(),dto.getOrder()))){
                throw new AppException(ErrorCode.PRODUCT_NOT_EXISTED_IN_ORDER_OR_STATUS_IN_OR_UNCOMPLETED);
            }else {
                ProductEntity product = productRepository.findByCode(dto.getProduct()).orElseThrow(
                        () -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED)
                );
                LocalDateTime ngayHoanThanh = order.getUpdatedAt();
                Integer thoiGianBaoHanh = product.getWarrantyMonths();
                LocalDateTime hanBaoHanh = ngayHoanThanh.plusMonths(thoiGianBaoHanh);
                LocalDateTime now = LocalDateTime.now();
                if (now.isAfter(hanBaoHanh)) {
                    throw new AppException(ErrorCode.WARRANTY_TIME_EXPIRED);
                }
            }
        }
        if(ObjectUtils.isEmpty(dto.getCustomer())){
            throw new AppException(ErrorCode.REPORT_WARRANTY_MUST_HAVE_CUSTOMER);
        }else {
            if(!userRepository.findAllCode().contains(dto.getCustomer())){
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }
        }
        if(ObjectUtils.isEmpty(dto.getStatus()))
        {
            dto.setStatus(StatusWarranty.PENDING.getValue());
        }else {
            if (!dto.getStatus().equals(StatusWarranty.PENDING.getValue())) {
                throw new AppException(ErrorCode.STATUS_CREATE_REPORT_WARRANTY_MUST_BE_PENDING);
            }
        }
        if(ObjectUtils.isEmpty(dto.getQuantity())){
            throw new AppException(ErrorCode.REPORT_WARRANTY_MUST_HAVE_QUANTITY);
        }else{
            if(orderRepository.findQuantityByCode(dto.getOrder(),dto.getProduct())==null)
            {
                throw new AppException(ErrorCode.QUANTITY_IN_REPORT_MUST_BE_GREATER_THAN_QUANTITY_IN_ORDER);
            }
            if(dto.getQuantity() > orderRepository.findQuantityByCode(dto.getOrder(),dto.getProduct())){
                throw new AppException(ErrorCode.QUANTITY_IN_REPORT_MUST_BE_GREATER_THAN_QUANTITY_IN_ORDER);
            }
        }
        LocalDateTime now = LocalDateTime.now();
        if(ObjectUtils.isEmpty(dto.getWarrantyDate())){
         dto.setWarrantyDate(now);
        }
        if(!ObjectUtils.isEmpty(dto.getCompleteDate())){
            throw new AppException(ErrorCode.CREATE_REPORT_WARRANTY_WITHOUT_COMPLETE_DATE);
        }
        modelMapper.map(dto, warrantyEntity);
        reportWarrantyRepository.save(warrantyEntity);
        return modelMapper.map(warrantyEntity, ReportWarrantyDto.class);
    }

    public String generateNextCode() {

        Integer maxCode = reportWarrantyRepository.findMaxCodeByPrefix();


        if (maxCode == null) {
            return "RW001";
        }

        return "RW" + String.format("%03d", ++maxCode);
    }
    public ReportWarrantyEntity base(String code){
        return reportWarrantyRepository.findByCode(code).orElseThrow(
                () -> new AppException(ErrorCode.REPORT_WARRANTY_NOT_EXISTED)
        );
    }

    public String receive(String code){
         ReportWarrantyEntity warrantyEntity=base(code);
        if(warrantyEntity.getStatus().equals(StatusWarranty.PENDING.getValue())){
            warrantyEntity.setStatus(StatusWarranty.RECEIVED.getValue());
        }else {
            throw new AppException(ErrorCode.CANNOT_CHANGE_STATUS_WARRANTY_TO_RECEIVED);
        }
        reportWarrantyRepository.save(warrantyEntity);
        return "Đã nhận sản phẩm bảo hành";
    }
    public String inProgress(String code){
        ReportWarrantyEntity warrantyEntity=base(code);
        if(warrantyEntity.getStatus().equals(StatusWarranty.RECEIVED.getValue())){
            warrantyEntity.setStatus(StatusWarranty.IN_PROGRESS.getValue());
        }else {
            throw new AppException(ErrorCode.CANNOT_CHANGE_STATUS_WARRANTY_TO_IN_PROGRESS);
        }
        reportWarrantyRepository.save(warrantyEntity);
        return "Đang trong quá trình xử lý";
    }
    public String complete(String code){
        ReportWarrantyEntity warrantyEntity=base(code);
        if(warrantyEntity.getStatus().equals(StatusWarranty.IN_PROGRESS.getValue())){
            warrantyEntity.setStatus(StatusWarranty.COMPLETED.getValue());
        }else {
            throw new AppException(ErrorCode.CANNOT_CHANGE_STATUS_WARRANTY_TO_COMPLETED);
        }
        LocalDateTime now = LocalDateTime.now();
        warrantyEntity.setCompleteDate(now);
        reportWarrantyRepository.save(warrantyEntity);
        return "Đã hoàn thành bảo hành sản phẩm";
    }
    public String returned(String code){
        ReportWarrantyEntity warrantyEntity=base(code);
        if(warrantyEntity.getStatus().equals(StatusWarranty.COMPLETED.getValue())){
            warrantyEntity.setStatus(StatusWarranty.RETURNED.getValue());
        }else {
            throw new AppException(ErrorCode.CANNOT_CHANGE_STATUS_WARRANTY_TO_RETURNED);
        }
        warrantyEntity.setCompleteDate(LocalDateTime.now());
        reportWarrantyRepository.save(warrantyEntity);
        return "Đã hoàn trả sản phẩm bảo hành";
    }
    public String rejected(String code){
        ReportWarrantyEntity warrantyEntity=base(code);
        if(warrantyEntity.getStatus().equals(StatusWarranty.RECEIVED.getValue())){
            warrantyEntity.setStatus(StatusWarranty.IN_PROGRESS.getValue());
        }else {
            throw new AppException(ErrorCode.CANNOT_CHANGE_STATUS_WARRANTY_TO_REJECTED);
        }
        reportWarrantyRepository.save(warrantyEntity);
        return "Từ chối bảo hành";
    }
    @Override
    public List<WarrantyDto> findAll(){
        return reportWarrantyRepository.findAllWarranty();
    }
    @Override
    public List<WarrantyDto> findByUser(String code){
        return reportWarrantyRepository.findAllWarrantyByEmployee(code);
    }
    @Override
    public WarrantyDetailDto findByCode(String code){
        return reportWarrantyRepository.findWarrantyDetail(code);
    }
}
