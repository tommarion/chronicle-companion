package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.sqlite.AccountCharacterDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class AccountCharacterDTOMapper implements RowMapper<AccountCharacterDTO> {
    @Override
    public AccountCharacterDTO mapRow(ResultSet resultSet, int i) throws SQLException {
        return AccountCharacterDTO.builder()
                .accountId(resultSet.getString("account_id"))
                .characterId(resultSet.getString("character_id"))
                .build();
    }
}
