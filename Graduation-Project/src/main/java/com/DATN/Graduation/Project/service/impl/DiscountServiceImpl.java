package com.DATN.Graduation.Project.service.impl;

import com.DATN.Graduation.Project.dto.DiscountDto;
import com.DATN.Graduation.Project.entity.DiscountEntity;
import com.DATN.Graduation.Project.exception.AppException;
import com.DATN.Graduation.Project.exception.ErrorCode;
import com.DATN.Graduation.Project.mapper.DiscountMapper;
import com.DATN.Graduation.Project.repository.DiscountRepository;
import com.DATN.Graduation.Project.service.DiscountService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DiscountServiceImpl implements DiscountService {
    @Autowired
    private final DiscountRepository discountRepository;
    @Autowired
    private final DiscountMapper discountMapper;

    @Override
    @Transactional
    public DiscountEntity saveDiscount(DiscountDto dto){
        if(!ObjectUtils.isEmpty(dto.getCode())){
            if(!ObjectUtils.isEmpty(discountRepository.findByCode(dto.getId(),dto.getCode()))){
                throw new AppException(ErrorCode.DISCOUNT_EXISTED);
            }
        }
        DiscountEntity discountEntity ;
        if(ObjectUtils.isEmpty(dto.getId())){
            discountEntity = new DiscountEntity();
            if(ObjectUtils.isEmpty(dto.getCode())){
                dto.setCode(generateNextCode());
            }
        }else{
            discountEntity = discountRepository.findById(dto.getId()).orElseThrow(
                    () -> new AppException(ErrorCode.DISCOUNT_NOT_EXISTED)
            );
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
        boolean validationDate = dto.getEndDate() != null && dto.getStartDate() != null && dto.getStartDate().isBefore(dto.getEndDate());
        if(!validationDate){
            throw new AppException(ErrorCode.VALIDATION_DATE_FALSE);
        }
        if(!ObjectUtils.isEmpty(dto.getType())){
            if (!List.of(1, 2).contains(dto.getType())){
                throw new AppException(ErrorCode.INVALID_DISCOUNT_TYPE);
            }else{
                if(dto.getType()==1 && (dto.getValue() <0 || dto.getValue() > 50)){
                    throw new AppException(ErrorCode.INVALID_DISCOUNT_VALUE);
                }
            }
        }else{
            throw new RuntimeException("Không được để trống");
        }
        discountEntity = discountMapper.toDiscount(dto);
        return discountRepository.save(discountEntity);
    }
    public String generateNextCode() {

        Integer maxCode = discountRepository.findMaxCodeByPrefix();


        if (maxCode == null) {
            return "D001";
        }

        return "D" + String.format("%03d", ++maxCode);
    }

    @Override
    public List<DiscountEntity> findAllIsDiscountValid(){
        LocalDateTime now = LocalDateTime.now();
        return discountRepository.findAllDeleted(now);
    }

    @Override
    @Transactional
    public String hiddenDiscount(String code){
        DiscountEntity entity = discountRepository.findByCode(code);
        if(ObjectUtils.isEmpty(entity)){
            throw new AppException(ErrorCode.DISCOUNT_NOT_EXISTED);
        }
        entity.setIsDeleted(true);
        discountRepository.save(entity);
        return "Hidden Discount successfully";
    }

    @Override
    @Transactional
    public String deleteDiscount(String code){
        DiscountEntity entity = discountRepository.findByCode(code);
        if(ObjectUtils.isEmpty(entity)){
            throw new AppException(ErrorCode.DISCOUNT_NOT_EXISTED);
        }
        discountRepository.delete(entity);
        return "Deleted Discount successfully";
    }
    @Override
    public boolean isDiscountValid(String code) {
        Optional<DiscountEntity> discountOpt = discountRepository.findValidDiscountByCode(code, LocalDateTime.now());
        return discountOpt.isPresent();
    }

    @Override
    public String activateDiscount(String code){
        DiscountEntity entity = discountRepository.findByCode(code);
        if(ObjectUtils.isEmpty(entity)){
            throw new AppException(ErrorCode.DISCOUNT_NOT_EXISTED);
        }
        entity.setIsDeleted(false);
        discountRepository.save(entity);
        return "Hidden Discount successfully";
    }

    @Override
    public DiscountEntity getDetail(String code) {
        DiscountEntity discountOpt = discountRepository.findByCode(code);
        if(ObjectUtils.isEmpty(discountOpt)){
            throw new AppException(ErrorCode.DISCOUNT_NOT_EXISTED);
        }
        return discountOpt;
    }
    @Override
    public List<DiscountEntity> findAll() {
        return discountRepository.findAll();
    }
}
