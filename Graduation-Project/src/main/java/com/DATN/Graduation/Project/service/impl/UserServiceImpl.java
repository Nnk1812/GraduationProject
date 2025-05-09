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
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.config.authentication.PasswordEncoderParser;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Objects;

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
    @Autowired
    private JavaMailSender mailSender;
//    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
//        this.userRepository = userRepository;
//        this.userMapper = userMapper;
//    }

    @Override
    public String setRole(String code,String role) {
        UserEntity user =  userRepository.findByCode(code).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED)
        );
//        if(Objects.equals(user.getRole(), "ADMIN")){
            user.setRole(role);
//        }
//        else {
//            throw new AppException(ErrorCode.YOU_DO_NOT_HAVE_PERMISSION);
//        }
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
        UserEntity  user  = userMapper.toUserEntity(dto);
        if (!ObjectUtils.isEmpty(dto.getPassWord())) {
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
            user.setPassWord(passwordEncoder.encode(dto.getPassWord()));
        } else if (!ObjectUtils.isEmpty(dto.getId())) {
            user.setPassWord(userRepository.findById(dto.getId()).orElseThrow().getPassWord());
        }
        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES);
        if(!ObjectUtils.isEmpty(dto.getDateIn())){
            user.setDateIn(dto.getDateIn());
        }
        else{
            user.setDateIn(now);
        }
        if(ObjectUtils.isEmpty(dto.getCode()))
        {
            if(userRepository.findAllEmail().contains(dto.getEmail())){
                throw new AppException(ErrorCode.EMAIL_EXISTED);
            }
            if(userRepository.findAllPhone().contains(dto.getPhone())){
                throw new AppException(ErrorCode.PHONE_EXISTED);
            }
            user.setRole("USER");
        }
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
    public UserEntity getUser(String code) {
        return userRepository.findByCode(code).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)
        );
    }
    @Override
    public List<UserEntity> getAllUser(){
        return userRepository.findAll();
    }

    @Override
    public String deleteUser(String code) {
        UserEntity user = userRepository.findByCode(code).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)
        );
//        if(Objects.equals(user.getRole(), "ADMIN")){
            userRepository.delete(user);
//        }else {
//            throw new AppException(ErrorCode.YOU_DO_NOT_HAVE_PERMISSION);
//        }
        return "success";
    }
    @Override
    public String hiddenUser(String code) {
        UserEntity user = userRepository.findByCode(code).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)
        );
//        if(Objects.equals(user.getRole(), "ADMIN")){
            user.setIsDeleted(true);
//        }else {
//            throw new AppException(ErrorCode.YOU_DO_NOT_HAVE_PERMISSION);
//        }
        userRepository.save(user);
        return "success";
    }

    @Override
    public String activeUser(String code) {
        UserEntity user = userRepository.findByCode(code).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)
        );
//        if(Objects.equals(user.getRole(), "ADMIN")){
            user.setIsDeleted(false);
//        }else {
//            throw new AppException(ErrorCode.YOU_DO_NOT_HAVE_PERMISSION);
//        }
        userRepository.save(user);
        return "success";
    }

    @Override
    public UserEntity getUserByUserName(String user) {
        return userRepository.findByUserName(user).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)
        );
    }
    @Override
    public String changePassword(String code,String password,String newPassword){
        UserEntity user = userRepository.findByCode(code).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)
        );
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        if (!passwordEncoder.matches(password, user.getPassWord())) {
            throw new AppException(ErrorCode.INVALID_OLD_PASSWORD); // hoặc tạo thêm mã lỗi riêng
        }

        // Encode password mới và lưu
        user.setPassWord(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return "Đổi mật khẩu thành công!";
    }
    @Override
    public String setPassword(String code,String password){
        UserEntity user = userRepository.findByCode(code).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)
        );
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPassWord(passwordEncoder.encode(password));

        userRepository.save(user);
        return "success";
    }
}
