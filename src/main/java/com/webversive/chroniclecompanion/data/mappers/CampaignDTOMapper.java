package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.sqlite.CampaignDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

@Slf4j
public class CampaignDTOMapper implements RowMapper<CampaignDTO> {
    @Override
    public CampaignDTO mapRow(ResultSet resultSet, int i) throws SQLException {
        return CampaignDTO.builder()
                .id(resultSet.getString("id"))
                .name(resultSet.getString("name"))
                .gameType(resultSet.getString("game_type"))
                .enabled(resultSet.getBoolean("enabled"))
                .build();
    }
}
