package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.app.CampaignBook;
import com.webversive.chroniclecompanion.data.app.CharacterBeing;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

@Slf4j
public class CampaignBookMapper implements RowMapper<CampaignBook> {
    @Override
    public CampaignBook mapRow(ResultSet resultSet, int i) throws SQLException {
        CharacterBeing character = CharacterBeing.builder()
                .id("")
                .name("Storyteller")
                .build();
        boolean enabled = true; // Auto enable campaign, only check if we have character data

        // If there are more columns in the result set than there are fields in the CampaignDTO object, we can assume
        // there is some character data there, so initialize that
        if (resultSet.getMetaData().getColumnCount() > 6) {
            character = CharacterBeing.builder()
                    .name(resultSet.getString(7))
                    .id(resultSet.getString(8))
                    .build();
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
