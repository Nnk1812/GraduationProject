package com.DATN.Graduation.Project.mapper;

import com.DATN.Graduation.Project.dto.UserDto;
import com.DATN.Graduation.Project.dto.request.UserRequest;
import com.DATN.Graduation.Project.entity.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserEntity toUser(UserRequest request);

    UserEntity toUserEntity(UserDto user);
}
