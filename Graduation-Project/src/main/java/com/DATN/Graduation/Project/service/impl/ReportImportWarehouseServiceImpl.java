package com.DATN.Graduation.Project.service.impl;

import com.DATN.Graduation.Project.constant.enums.DiscountTypeEnum;
import com.DATN.Graduation.Project.constant.enums.StatusImportWarehouseEnum;
import com.DATN.Graduation.Project.dto.OrderDetailDto;
import com.DATN.Graduation.Project.dto.OrderDto;
import com.DATN.Graduation.Project.dto.ReportImportWarehouseDto;
import com.DATN.Graduation.Project.dto.WarehouseImportProductDto;
import com.DATN.Graduation.Project.entity.*;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

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
    @Autowired
    private StockRepository stockRepository;

    @Override
    @Transactional
    public ReportImportWarehouseDto saveWarehouse(ReportImportWarehouseDto dto) {
        if (!ObjectUtils.isEmpty(dto.getCode())) {
            if (!ObjectUtils.isEmpty(reportImportWarehouseRepository.findByCode(dto.getId(), dto.getCode()))) {
                throw new AppException(ErrorCode.REPORT_IMPORT_WAREHOUSE_NOT_EXISTED);
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
            if(!userRepository.findAllFullName().contains(dto.getEmployee())) {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
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
            if(!dto.getStatus().equals(StatusImportWarehouseEnum.DANG_TAO.getValue())&& ObjectUtils.isEmpty(dto.getId())){
                throw new AppException(ErrorCode.STATUS_WRONG);
            }
        }
        LocalDateTime now = LocalDateTime.now();
        if (ObjectUtils.isEmpty(dto.getImportDate())) {
            dto.setImportDate(now);
        }
        WarehouseImportProductEntity importProductEntity;

        long price =0  ;
        if(dto.getProducts() != null) {
            if (dto.getId() != null) {
                List<WarehouseImportProductEntity> existingProducts =
                        warehouseImportProductRepository.findByCode(warehouseEntity.getCode());

                Set<Long> incomingProductIds = dto.getProducts().stream()
                        .map(WarehouseImportProductDto::getId)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet());

                for (WarehouseImportProductEntity existingProduct : existingProducts) {
                    if (!incomingProductIds.contains(existingProduct.getId())) {
                        warehouseImportProductRepository.deleteById(existingProduct.getId());
                    }
                }
            }
            List<WarehouseImportProductDto> importProductDto = dto.getProducts();
            for(WarehouseImportProductDto productDto : importProductDto) {
                if(!ObjectUtils.isEmpty(productDto.getReportImportWarehouse())&&!ObjectUtils.isEmpty(productDto.getId())) {
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
                long totalPrice = productDto.getQuantity() * productDto.getPrice();
                long realPrice=0;
                importProductEntity.setProduct(product.getCode());
                importProductEntity.setName(product.getName());
                String brandName = brandRepository.findBrandNameByCode(product.getBrand());
                importProductEntity.setBrand(brandName);
                importProductEntity.setPrice(productDto.getPrice());
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
            if (dto.getStatus() == 3) {
                for (WarehouseImportProductDto productDto : importProductDto) {
                    long sellingPrice = productDto.getPrice();
                    ProductEntity product = productRepository.findByCode(productDto.getProduct())
                            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
                    StockEntity stockEntity = new StockEntity();
                    stockEntity.setProduct(product.getCode());
                    stockEntity.setReport(dto.getCode());
                    stockEntity.setQuantity(productDto.getQuantity());
                    stockEntity.setImportDate(now);
                    stockEntity.setName(product.getName());
                    stockEntity.setImportPrice(sellingPrice);
                    stockEntity.setNote("Nhập kho từ phiếu: " + warehouseEntity.getCode());
                    stockEntity.setSellingPrice((sellingPrice + (sellingPrice * 10/100) + 12000000/200 + 25000000/200)*( 1+ 30/100));
                    stockRepository.save(stockEntity);
                    sellingPrice = stockEntity.getSellingPrice();
                    product.setPrice(sellingPrice);
                    long realPrice = 0;
                    if(product.getDiscount() != null) {
                        if(Objects.equals(discountRepository.getDiscountType(product.getDiscount()), DiscountTypeEnum.PHAN_TRAM.getValue())){
                            realPrice = sellingPrice - (sellingPrice * discountRepository.getDiscountValue(product.getDiscount())/100);
                            product.setRealPrice(realPrice);
                        }if (Objects.equals(discountRepository.getDiscountType(product.getDiscount()), DiscountTypeEnum.TIEN_MAT.getValue())){
                            realPrice = sellingPrice - discountRepository.getDiscountValue(product.getDiscount());
                            product.setRealPrice(realPrice);
                        }
                    }
                    else {
                        realPrice = sellingPrice;
                    }
                    product.setRealPrice(realPrice);
                    productRepository.save(product);
                }
            }

        }else {
            throw new AppException(ErrorCode.REPORT_MUST_HAVE_PRODUCT);
        }
        warehouseEntity.setPrice(price + price *10/100);
        warehouseEntity.setDiscount(dto.getDiscount());
        if(dto.getDiscount() != null && !ObjectUtils.isEmpty(dto.getDiscount())) {
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
    @Override
    public List<ReportImportWarehouseEntity> findAllReportImportWarehouse() {
        return reportImportWarehouseRepository.findAll();
    }

    @Override
    public ReportImportWarehouseDto findReportImportWarehouseDetail(String code){
        ReportImportWarehouseEntity entity = reportImportWarehouseRepository.findByCode(code);
        if(ObjectUtils.isEmpty(entity)) {
            throw new AppException(ErrorCode.REPORT_IMPORT_WAREHOUSE_NOT_EXISTED);
        }
        ReportImportWarehouseDto dto = new ReportImportWarehouseDto();
        modelMapper.map(entity,dto);
        List<WarehouseImportProductEntity> entities = warehouseImportProductRepository.findByCode(entity.getCode());
        if(ObjectUtils.isEmpty(entities)) {
            throw new AppException(ErrorCode.WAREHOUSE_IMPORT_PRODUCT_NOT_EXISTED);
        }
        List<WarehouseImportProductDto> productDtos = entities.stream()
                .map(product -> modelMapper.map(product, WarehouseImportProductDto.class))
                .collect(Collectors.toList());

        dto.setProducts(productDtos);
        return dto;
    }
}

