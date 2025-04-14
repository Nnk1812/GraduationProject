package com.DATN.Graduation.Project.service.impl;

import com.DATN.Graduation.Project.entity.CartEntity;
import com.DATN.Graduation.Project.exception.AppException;
import com.DATN.Graduation.Project.exception.ErrorCode;
import com.DATN.Graduation.Project.mapper.UserMapper;
import com.DATN.Graduation.Project.dto.UserDto;
import com.DATN.Graduation.Project.entity.UserEntity;
import com.DATN.Graduation.Project.repository.CartRepository;
import com.DATN.Graduation.Project.repository.UserRepository;
import com.DATN.Graduation.Project.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.authentication.PasswordEncoderParser;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    @Autowired
    private  UserRepository userRepository;
    @Autowired
    private  UserMapper userMapper;
    @Autowired
    private CartRepository cartRepository;
//    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
//        this.userRepository = userRepository;
//        this.userMapper = userMapper;
//    }

    @Override
    public String setRole(Long id,String role) {
        UserEntity user =  userRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED)
        );
        user.setRole(role);
        userRepository.save(user);
        return "success";
    }

    @Override
    @Transactional
    public UserEntity saveUser(UserDto dto) {
        if(ObjectUtils.isEmpty(dto.getId()))
        {
            if(ObjectUtils.isEmpty(dto.getCode())){
                dto.setCode(generateNextCode());
            }else {
                if (userRepository.findAllCode().contains(dto.getCode())) {
                    throw new AppException(ErrorCode.USER_EXISTED);
                }
            }
        }
        UserEntity  user  = userMapper.toUserEntity(dto);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPassWord(passwordEncoder.encode(dto.getPassWord()));
        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES);
        if(!ObjectUtils.isEmpty(dto.getDateIn())){
            user.setDateIn(dto.getDateIn());
        }
        else{
            user.setDateIn(now);
        }
        if (ObjectUtils.isEmpty(dto.getIsDeleted())) {
            dto.setIsDeleted(false);
        } else {
            dto.setIsDeleted(dto.getIsDeleted());
        }
        if (ObjectUtils.isEmpty(dto.getIsActive())) {
            dto.setIsActive(true);
        } else {
            dto.setIsActive(dto.getIsActive());
        }
        if(userRepository.findAllEmail().contains(dto.getEmail())){
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        if(userRepository.findAllPhone().contains(dto.getPhone())){
            throw new AppException(ErrorCode.PHONE_EXISTED);
        }
        user.setRole("User");
        CartEntity cart = new CartEntity();
        cart.setUser(dto.getCode());
        cartRepository.save(cart);
        return userRepository.save(user);
    }

    public String generateNextCode(){
        Integer maxCode = userRepository.findMaxCodeByPrefix();
        if(maxCode == null){
            return "NV001";
        }
        return "NV" + String.format("%03d", ++maxCode);
    }

    @Override
    public UserEntity getUser(Long id) {
        return userRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)
        );
    }
    @Override
    public List<UserEntity> getAllUser(){
        return userRepository.findAll();
    }

    @Override
    public String deleteUser(Long id) {
        userRepository.deleteById(id);
        return "success";
    }
}
