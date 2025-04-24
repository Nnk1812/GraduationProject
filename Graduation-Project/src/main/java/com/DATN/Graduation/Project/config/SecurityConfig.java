package com.DATN.Graduation.Project.config;

import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;


@Configuration
public class SecurityConfig {
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String signerKey;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable).
                authorizeHttpRequests(authorizeRequests ->
                authorizeRequests
//                        .requestMatchers(HttpMethod.POST,"/auth/log-in").permitAll()
//                        .requestMatchers(HttpMethod.GET,"/order/detail").hasRole("ADMIN")
//                        .requestMatchers(HttpMethod.POST,"/user/saveUser").permitAll());

                        .anyRequest().permitAll());
        http.oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwtConfigurer -> jwtConfigurer.
                        decoder(jwtDecoder())
                        .jwtAuthenticationConverter(jwtAuthenticationConverter())));
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        SecretKeySpec spec = new SecretKeySpec(signerKey.getBytes(), "HS512");
       return NimbusJwtDecoder.withSecretKey(spec)
               .macAlgorithm(MacAlgorithm.HS512)
               .build();
    }
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix(""); // Nếu bạn dùng "ROLE_" sẵn thì giữ nguyên hoặc set ""
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles"); // Phải khớp với tên claim trong token

        JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
        authenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return authenticationConverter;
    }

}
