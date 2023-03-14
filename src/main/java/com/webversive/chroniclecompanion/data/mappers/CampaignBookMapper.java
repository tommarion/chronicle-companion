package com.webversive.chroniclecompanion.data.mappers;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.webversive.chroniclecompanion.data.app.CampaignBook;
import com.webversive.chroniclecompanion.data.app.CharacterBeing;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.util.StringUtils;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class CampaignBookMapper implements RowMapper<CampaignBook> {

    @Override
    public CampaignBook mapRow(ResultSet resultSet, int i) throws SQLException {
        Gson gson = new Gson();
        String gameType = resultSet.getString("game_type");
        CharacterBeing character = CharacterBeing.builder()
                .id("")
                .build();
        switch (gameType) {
            case "vtm":
            case "vampire":
                character.setName("Storyteller");
                break;
            case "dnd":
                character.setName("DM");
                break;
            default:
                character.setName("GM");
        }
        boolean enabled = true; // Auto enable campaign, only check if we have character data
        // If there are more columns in the result set than there are fields in the CampaignDTO object, we can assume
        // there is some character data there, so initialize that
        if (resultSet.getMetaData().getColumnCount() == 11) {
            character = CharacterBeing.builder()
                    .name(resultSet.getString(8))
                    .id(resultSet.getString(9))
                    .build();
            enabled = resultSet.getBoolean("enabled");
        }

        List<CharacterBeing> players = new ArrayList<>();

        if (resultSet.getMetaData().getColumnCount() == 10) {
            String playersString = resultSet.getString("players");
            if (StringUtils.hasText(playersString)) {
                players.addAll(gson.fromJson('[' + resultSet.getString("players") + ']',
                        new TypeToken<ArrayList<CharacterBeing>>() {}.getType()));
            }
        }
        return CampaignBook.builder()
                .id(resultSet.getString("id"))
                .name(resultSet.getString("name"))
                .gameType(gameType)
                .enabled(enabled)
                .character(character)
                .sessions(resultSet.getInt("session_count"))
                .lastPlayed(resultSet.getString("last_played"))
                .players(players)
                .build();
    }
}
