package com.DATN.Graduation.Project.service.impl;

import com.DATN.Graduation.Project.dto.BrandDto;
import com.DATN.Graduation.Project.entity.BrandEntity;
import com.DATN.Graduation.Project.entity.DiscountEntity;
import com.DATN.Graduation.Project.exception.AppException;
import com.DATN.Graduation.Project.exception.ErrorCode;
import com.DATN.Graduation.Project.mapper.BrandMapper;
import com.DATN.Graduation.Project.repository.BrandRepository;
import com.DATN.Graduation.Project.service.BrandService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BrandServiceImpl implements BrandService {
    @Autowired
    private final BrandRepository brandRepository;
    @Autowired
    private final BrandMapper brandMapper;

    @Override
    @Transactional
    public BrandEntity saveBrand(BrandDto dto){
        if(!ObjectUtils.isEmpty(dto.getCode())){
            if(!ObjectUtils.isEmpty(brandRepository.findByCode(dto.getId(),dto.getCode()))){
                throw new AppException(ErrorCode.DISCOUNT_EXISTED);
            }
        }
        BrandEntity brandEntity ;
        if(ObjectUtils.isEmpty(dto.getId())){
            brandEntity = new BrandEntity();
            if(ObjectUtils.isEmpty(dto.getCode())){
                dto.setCode(generateNextCode());
            }
        }else{
            brandEntity = brandRepository.findById(dto.getId()).orElseThrow(
                    () -> new AppException(ErrorCode.BRAND_NOT_EXISTED)
            );
        }
        if(ObjectUtils.isEmpty(dto.getCode())){
            if(brandRepository.findBrandName().contains(dto.getName())){
                throw new AppException(ErrorCode.BRAND_EXISTED);
            }
        }
        if(ObjectUtils.isEmpty(dto.getIsActive())){
            dto.setIsActive(true);
        }else {
            dto.setIsActive(dto.getIsActive());
        }
        if(ObjectUtils.isEmpty(dto.getIsDeleted())){
            dto.setIsDeleted(false);
        }
        else {
            dto.setIsDeleted(dto.getIsDeleted());
        }
        brandEntity = brandMapper.toBrandEntity(dto);
        return brandRepository.save(brandEntity);
    }

    public String generateNextCode() {

        Integer maxCode = brandRepository.findMaxCodeByPrefix();


        if (maxCode == null) {
            return "B001";
        }

        return "B" + String.format("%03d", ++maxCode);
    }

    @Override
    public String hiddenBrand(Long id){
        BrandEntity brandEntity = brandRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.BRAND_NOT_EXISTED)
        );
        brandEntity.setIsDeleted(true);
        brandRepository.save(brandEntity);
        return "Hidden Brand Successfully";
    }

    @Override
    @Transactional
    public String deleteBrand(String code){
        BrandEntity brandEntity = brandRepository.findByCode(code);
        if(ObjectUtils.isEmpty(brandEntity)){
            throw new AppException(ErrorCode.BRAND_NOT_EXISTED);
        }
        brandRepository.delete(brandEntity);
        return "Deleted Brand Successfully";
    }
    @Override
    public List<BrandEntity> findAll(){
        return brandRepository.findAll();
    }

    @Override
    public BrandEntity getDetail(String code){
        BrandEntity entity = brandRepository.findByCode(code);
        if (ObjectUtils.isEmpty(entity)) {
            throw new AppException(ErrorCode.BRAND_NOT_EXISTED);
        }
        return entity;
    }

    @Override
    public String findBrandByCode(String code){
        BrandEntity brandEntity = brandRepository.findByCode(code);
        if (ObjectUtils.isEmpty(brandEntity)) {
            throw new AppException(ErrorCode.BRAND_NOT_EXISTED);
        }
        return brandEntity.getName();
    }
}
