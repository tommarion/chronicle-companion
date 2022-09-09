package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.app.character.VtmAdvantageFlaw;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class VtmCharacterAdvantageFlawMapper implements RowMapper<VtmAdvantageFlaw> {
    @Override
    public VtmAdvantageFlaw mapRow(ResultSet resultSet, int i) throws SQLException {
        return VtmAdvantageFlaw.builder()
                .name(resultSet.getString("name"))
                .level(resultSet.getInt("level"))
                .type(resultSet.getString("type"))
                .build();
    }
}
