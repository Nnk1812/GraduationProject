package com.DATN.Graduation.Project.service.impl;

import com.DATN.Graduation.Project.dto.request.AuthenticateRequest;
import com.DATN.Graduation.Project.dto.response.ApiResponse;
import com.DATN.Graduation.Project.dto.response.AuthenticateResponse;
import com.DATN.Graduation.Project.entity.UserEntity;
import com.DATN.Graduation.Project.exception.AppException;
import com.DATN.Graduation.Project.exception.ErrorCode;
import com.DATN.Graduation.Project.repository.UserRepository;
import com.DATN.Graduation.Project.service.AuthenticateService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticateServiceImpl implements AuthenticateService {
    @Autowired
    private UserRepository userRepository;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String signerKey;
    @Override
    public AuthenticateResponse authenticate(AuthenticateRequest request) {
        UserEntity user = userRepository.findByUserName(request.getUsername()).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)
        );
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean  authenticate = passwordEncoder.matches(request.getPassword(),user.getPassWord());
        if(!authenticate){
            throw new AppException(ErrorCode.NOT_AUTHENTICATED);
        }
        String token = generateToken(user);
        return AuthenticateResponse.builder()
                .token(token)
                .build();
    }
    public String generateToken(UserEntity user){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUserName())
                .issuer("GraduationProject.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(10, ChronoUnit.DAYS).toEpochMilli()
                ))
                .claim("roles", List.of("ROLE_" + user.getRole()))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }

    }
}
