package com.DATN.Graduation.Project.service.impl;

import com.DATN.Graduation.Project.constant.enums.DiscountTypeEnum;
import com.DATN.Graduation.Project.constant.enums.StatusImportWarehouseEnum;
import com.DATN.Graduation.Project.dto.OrderDto;
import com.DATN.Graduation.Project.dto.ReportImportWarehouseDto;
import com.DATN.Graduation.Project.dto.WarehouseImportProductDto;
import com.DATN.Graduation.Project.entity.ProductEntity;
import com.DATN.Graduation.Project.entity.ReportImportWarehouseEntity;
import com.DATN.Graduation.Project.entity.WarehouseImportProductEntity;
import com.DATN.Graduation.Project.exception.AppException;
import com.DATN.Graduation.Project.exception.ErrorCode;
import com.DATN.Graduation.Project.repository.*;
import com.DATN.Graduation.Project.service.ReportImportWarehouseService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.Conditions;
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
public class ReportImportWarehouseServiceImpl implements ReportImportWarehouseService {
    @Autowired
    private final ReportImportWarehouseRepository reportImportWarehouseRepository;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final BrandRepository brandRepository;
    @Autowired
    private final DiscountRepository discountRepository;
    @Autowired
    private final WarehouseImportProductRepository warehouseImportProductRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    @Transactional
    public ReportImportWarehouseDto saveWarehouse(ReportImportWarehouseDto dto) {
        if (!ObjectUtils.isEmpty(dto.getCode())) {
            if (!ObjectUtils.isEmpty(reportImportWarehouseRepository.findByCode(dto.getId(), dto.getCode()))) {
                throw new AppException(ErrorCode.PRODUCT_NOT_EXISTED);
            }
        }
        ReportImportWarehouseEntity warehouseEntity;
        if(ObjectUtils.isEmpty(dto.getId())) {
            warehouseEntity = new ReportImportWarehouseEntity();
            if(ObjectUtils.isEmpty(dto.getCode())) {
                warehouseEntity.setCode(generateNextCode());
            }
        }else
            warehouseEntity = reportImportWarehouseRepository.findById(dto.getId()).orElseThrow(
                    ()->  new AppException(ErrorCode.REPORT_IMPORT_WAREHOUSE_NOT_EXISTED)
            );
        if(ObjectUtils.isEmpty(dto.getEmployee())) {
            throw new AppException(ErrorCode.MUST_HAVE_WAREHOUSE_EMPLOYEE);
        }else {
            if(!userRepository.findAllCode().contains(dto.getEmployee())) {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }
        }
        if(ObjectUtils.isEmpty(dto.getBrand())) {
            throw new AppException(ErrorCode.MUST_HAVE_WAREHOUSE_BRAND);
        }else {
            if(!brandRepository.findBrand().contains(dto.getBrand())) {
                throw new AppException(ErrorCode.BRAND_NOT_EXISTED);
            }
        }
        if(!ObjectUtils.isEmpty(dto.getDiscount())) {
            if(!discountRepository.findDiscount().contains(dto.getDiscount())){
                throw new AppException(ErrorCode.DISCOUNT_NOT_EXISTED);
            }
        }
        if (ObjectUtils.isEmpty(dto.getStatus())) {
            dto.setStatus(StatusImportWarehouseEnum.DANG_TAO.getValue());
        }else {
            if(!dto.getStatus().equals(StatusImportWarehouseEnum.DANG_TAO.getValue())){
                throw new AppException(ErrorCode.STATUS_WRONG);
            }
        }
        if (ObjectUtils.isEmpty(dto.getImportDate())) {
            LocalDateTime now = LocalDateTime.now();
            dto.setImportDate(now);
        }
        WarehouseImportProductEntity importProductEntity;
        long price =0  ;
        if(dto.getProducts() != null) {
            List<WarehouseImportProductDto> importProductDto = dto.getProducts();
            for(WarehouseImportProductDto productDto : importProductDto) {
                if(!ObjectUtils.isEmpty(productDto.getReportImportWarehouse())) {
                    importProductEntity = warehouseImportProductRepository.findById(productDto.getId()).orElseThrow(
                            ()-> new AppException(ErrorCode.PRODUCT_NOT_EXISTED)
                    );
                }else {
                    importProductEntity = new WarehouseImportProductEntity();
                    importProductEntity.setReportImportWarehouse(warehouseEntity.getCode());
                }
                ProductEntity product = productRepository.findByCode(productDto.getProduct()).orElseThrow(
                        ()-> new AppException(ErrorCode.PRODUCT_NOT_EXISTED)
                );
                long totalPrice = productDto.getQuantity() * product.getPrice();
                long realPrice=0;
                importProductEntity.setProduct(product.getCode());
                importProductEntity.setName(product.getName());
                importProductEntity.setPrice(product.getPrice());
                importProductEntity.setDiscount(productDto.getDiscount());
                importProductEntity.setQuantity(productDto.getQuantity());
                importProductEntity.setTotalPrice(totalPrice);
                if(productDto.getDiscount() != null) {
                    if(Objects.equals(discountRepository.getDiscountType(productDto.getDiscount()), DiscountTypeEnum.PHAN_TRAM.getValue())){
                         realPrice = totalPrice - (totalPrice * discountRepository.getDiscountValue(productDto.getDiscount())/100);
                         importProductEntity.setRealPrice(realPrice);
                    }if (Objects.equals(discountRepository.getDiscountType(productDto.getDiscount()), DiscountTypeEnum.TIEN_MAT.getValue())){
                        realPrice = totalPrice - discountRepository.getDiscountValue(productDto.getDiscount());
                        importProductEntity.setRealPrice(realPrice);
                    }
                }
                else {
                    realPrice = totalPrice;
                }
                price +=realPrice;
                warehouseImportProductRepository.save(importProductEntity);
            }
        }else {
            throw new AppException(ErrorCode.REPORT_MUST_HAVE_PRODUCT);
        }
        warehouseEntity.setPrice(price);
        warehouseEntity.setDiscount(dto.getDiscount());
        if(dto.getDiscount() != null) {
            long realPrice = 0;
            if(Objects.equals(discountRepository.getDiscountType(dto.getDiscount()), DiscountTypeEnum.TIEN_MAT.getValue())){
                long priceAfterDiscount = price - discountRepository.getDiscountValue(dto.getDiscount());
                realPrice = priceAfterDiscount + priceAfterDiscount*10/100;
                warehouseEntity.setRealPrice(realPrice);
            }
            if(Objects.equals(discountRepository.getDiscountType(dto.getDiscount()), DiscountTypeEnum.PHAN_TRAM.getValue())){
                long priceAfterDiscount = price - (price * discountRepository.getDiscountValue(dto.getDiscount())/100);
                realPrice = priceAfterDiscount + priceAfterDiscount*10/100;
                warehouseEntity.setRealPrice(realPrice);
            }
        }else {
            warehouseEntity.setRealPrice(price + price*10/100);
        }
        Long oldId = warehouseEntity.getId();
        modelMapper.map(dto,warehouseEntity);
        warehouseEntity.setId(oldId);
        ReportImportWarehouseEntity savedEntity = reportImportWarehouseRepository.save(warehouseEntity);
        return modelMapper.map(savedEntity, ReportImportWarehouseDto.class);

    }
    public String generateNextCode() {

        Integer maxCode = reportImportWarehouseRepository.findMaxCodeByPrefix();


        if (maxCode == null) {
            return "W001";
        }

        return "W" + String.format("%03d", ++maxCode);
    }
}
