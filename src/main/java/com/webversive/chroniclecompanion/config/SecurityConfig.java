package com.webversive.chroniclecompanion.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import javax.sql.DataSource;

@Configuration
@Slf4j
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
//        log.info(bCryptPasswordEncoder.encode("testpass"));
//        log.info(bCryptPasswordEncoder.encode("Schrecknet"));
        return bCryptPasswordEncoder;
    }

    @Bean
    public UserDetailsManager users(DataSource dataSource) {

//        UserDetails user = User.builder()
//                .username("testuser")
//                .password("$2a$10$lhTkPA3Z0ZsRIjWNHj/vqey0YJmzGcjZx90foknQN2nmZXC2SXfM2")
//                .roles("USER")
//                .build();
//
//        UserDetails admin = User.builder()
//                .username("storyteller")
//                .password("$2a$10$cBrwMjbVvQ9bnwhTA/V1GuYpqsZWKglEypVuwRRQDHFV4ymBpn0Oa")
//                .roles("USER", "ADMIN")
//                .build();

        JdbcUserDetailsManager users = new JdbcUserDetailsManager(dataSource);
//        users.createUser(admin);
//        users.createUser(user);
        return users;
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http, BCryptPasswordEncoder bCryptPasswordEncoder,
                                             UserDetailsService userDetailsService)
            throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userDetailsService)
                .passwordEncoder(bCryptPasswordEncoder)
                .and()
                .parentAuthenticationManager(null)
                .build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .formLogin(form -> form
                        .loginPage("/login.html")
                        .loginProcessingUrl("/login")
                        .defaultSuccessUrl("/index.html")
                        .failureForwardUrl("/login.html?failure")
                        .failureUrl("/login.html?failure")
                        .permitAll()
                )
                .logout()
                .logoutSuccessUrl("/login.html")
                .and()
                .authorizeRequests((authz) -> authz
                        .antMatchers(
                                "/stylesheets/**",
                                "/javascript/**",
                                "/img/**",
                                "/appdata/**",
                                "/fonts/**",
                                "/sound-effects/**",
                                "/login.html?failure",
                                "/register",
                                "/secured/**/**",
                                "/secured/success",
                                "/secured/socket",
                                "/secured/success"
                        )
                        .permitAll()
                        .anyRequest().authenticated()
                ).csrf().disable();
        return http.build();
    }
}
