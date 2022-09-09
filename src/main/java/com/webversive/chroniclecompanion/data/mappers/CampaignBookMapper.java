package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.app.CampaignBook;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class CampaignBookMapper implements RowMapper<CampaignBook> {
    @Override
    public CampaignBook mapRow(ResultSet resultSet, int i) throws SQLException {
        Map<String, String> character = new HashMap<>(){{ put("Storyteller", ""); }};
        boolean enabled = true; // Auto enable campaign, only check if we have character data

        // If there are more columns in the result set than there are fields in the CampaignDTO object, we can assume
        // there is some character data there, so initialize that
        if (resultSet.getMetaData().getColumnCount() > 6) {
            character = new HashMap<>(){{ put(resultSet.getString(7), resultSet.getString(8)); }};
            enabled = resultSet.getBoolean("enabled");
        }

        return CampaignBook.builder()
                .id(resultSet.getString("id"))
                .name(resultSet.getString("name"))
                .gameType(resultSet.getString("game_type"))
                .enabled(enabled)
                .character(character)
                .build();
    }
}
