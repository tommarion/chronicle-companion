package com.webversive.chroniclecompanion.service;

import com.webversive.chroniclecompanion.service.sql.AccountSQLService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import static java.util.Objects.isNull;

@Service("userDetailsService")
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final AccountSQLService accountSqlService;

    public CustomUserDetailsService(AccountSQLService accountSqlService) {
        this.accountSqlService = accountSqlService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        UserDetails userDetails = accountSqlService.getUserDetailsByUsername(username);
        if (isNull(userDetails)) {
            throw new UsernameNotFoundException(username);
        }
        return userDetails;
    }

}
