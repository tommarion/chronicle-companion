package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.app.character.VtmTouchstones;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class VtmTouchstonesMapper implements RowMapper<VtmTouchstones> {
    @Override
    public VtmTouchstones mapRow(ResultSet resultSet, int i) throws SQLException {
        return VtmTouchstones.builder()
                .name(resultSet.getString("name"))
                .relationship(resultSet.getString("relationship"))
                .build();
    }
}
