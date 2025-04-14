package com.DATN.Graduation.Project.service;

import com.DATN.Graduation.Project.dto.UserDto;
import com.DATN.Graduation.Project.dto.request.UserRequest;
import com.DATN.Graduation.Project.entity.UserEntity;
import org.apache.catalina.User;

import java.util.List;

public interface UserService {

    String setRole(Long id,String role);


    UserEntity saveUser(UserDto dto);

    UserEntity getUser(Long id);

    List<UserEntity> getAllUser();

    String deleteUser(Long id);
}
