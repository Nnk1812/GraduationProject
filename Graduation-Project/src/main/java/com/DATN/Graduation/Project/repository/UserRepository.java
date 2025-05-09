package com.DATN.Graduation.Project.repository;

import com.DATN.Graduation.Project.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Long> {
    @Query(value = " select username " +
            "from user",nativeQuery = true)
    List<String> findAllUsername();

    @Query(value ="select max(cast(substring(code, 3,length(code) ) as unsigned ) ) from user where code like 'NV%' ", nativeQuery = true)
    Integer findMaxCodeByPrefix();

    @Query(value = "select code " +
            "from user",nativeQuery = true)
    List<String> findAllCode();
    @Query(value = "select full_name " +
            "from user",nativeQuery = true)
    List<String> findAllFullName();
    @Query(value = "select email " +
            "from user",nativeQuery = true)
    List<String> findAllEmail();
    @Query(value = "select phone " +
            "from  user ", nativeQuery = true)
    List<String> findAllPhone();
    @Query(value = "select * from user " +
            "where username = :username and is_deleted = 0 ",nativeQuery = true)
    Optional<UserEntity> findByUserName(String username);
    @Query(value = "select * from user " +
            "where username = :username and is_deleted = 1 ",nativeQuery = true)
    UserEntity findByUserNameAndDelete(String username);
    @Query(value = "select * " +
            "from user a " +
            "where a.code = :code ",nativeQuery = true)
    Optional<UserEntity> findByCode(String code);
    @Query(value = "select * from user a where a.username =:userName",nativeQuery = true)
    Optional<UserEntity> findFullNameByUserName(String userName);
    @Query(value = "select * from user a where a.phone =:phone and a.email =:email",nativeQuery = true)
    UserEntity findUser(String phone,String email);
}
