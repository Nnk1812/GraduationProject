package com.DATN.Graduation.Project.service;

import com.DATN.Graduation.Project.dto.UserDto;
import com.DATN.Graduation.Project.dto.request.UserRequest;
import com.DATN.Graduation.Project.entity.UserEntity;
import org.apache.catalina.User;

import java.util.List;

public interface UserService {

//    String sendSimpleEmail(String email);

    String setRole(String code,String role);


    UserEntity saveUser(UserDto dto);

    UserEntity getUser(String code);

    List<UserEntity> getAllUser();

    String deleteUser(String code);

    String hiddenUser(String code);

    String activeUser(String code);

    UserEntity getUserByUserName(String code);

    String changePassword(String code,String password,String newPassword);

    String setPassword(String phone,String email);

}
