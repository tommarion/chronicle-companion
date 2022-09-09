package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.app.character.VtmAttributesGroups;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class VtmAltAttributesMapper implements RowMapper<VtmAttributesGroups> {
    @Override
    public VtmAttributesGroups mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        return VtmAttributesGroups.builder()
                .mentalValue(resultSet.getInt("mental"))
                .socialValue(resultSet.getInt("social"))
                .physicalValue(resultSet.getInt("physical"))
                .build();
    }
}
