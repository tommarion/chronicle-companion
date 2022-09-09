package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.sqlite.CharacterDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class CharacterDTOLimitedMapper implements RowMapper<CharacterDTO> {
    @Override
    public CharacterDTO mapRow(ResultSet resultSet, int i) throws SQLException {
        return CharacterDTO.builder()
                .id(resultSet.getString("id"))
                .name(resultSet.getString("name"))
                .build();
    }
}
