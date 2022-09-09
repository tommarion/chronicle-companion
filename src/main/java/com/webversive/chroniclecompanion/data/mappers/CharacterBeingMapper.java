package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.app.CharacterBeing;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class CharacterBeingMapper implements RowMapper<CharacterBeing> {
    @Override
    public CharacterBeing mapRow(ResultSet resultSet, int i) throws SQLException {
        return CharacterBeing.builder()
                .id(resultSet.getString("id"))
                .being(resultSet.getString("being"))
                .name(resultSet.getString("name"))
                .build();
    }
}
