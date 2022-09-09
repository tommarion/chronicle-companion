package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.sqlite.AccountDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class AccountDTOMapper implements RowMapper<AccountDTO> {
    @Override
    public AccountDTO mapRow(ResultSet resultSet, int i) throws SQLException {
        return AccountDTO.builder()
                .id(resultSet.getString("id"))
                .username(resultSet.getString("username"))
                .build();
    }
}
