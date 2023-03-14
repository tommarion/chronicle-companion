package com.webversive.chroniclecompanion.service.sql;

import com.webversive.chroniclecompanion.data.app.CampaignBook;
import com.webversive.chroniclecompanion.data.app.CharacterBeing;
import com.webversive.chroniclecompanion.data.mappers.CampaignBookMapper;
import com.webversive.chroniclecompanion.data.mappers.CampaignDTOMapper;
import com.webversive.chroniclecompanion.data.mappers.CharacterBeingMapper;
import com.webversive.chroniclecompanion.data.mappers.CharacterDTOLimitedMapper;
import com.webversive.chroniclecompanion.data.sqlite.CampaignDTO;
import com.webversive.chroniclecompanion.data.sqlite.CharacterDTO;
import com.webversive.chroniclecompanion.enums.GameType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class CampaignSQLService {

    private final JdbcTemplate jdbcTemplate;

    public CampaignSQLService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<CampaignBook> getCampaignBooksWithPlayer(String username) {
        return jdbcTemplate.query(
                "SELECT campaigns.*, characters.name, characters.id, COUNT(sessions.id) AS session_count, MAX(sessions.date) AS last_played FROM campaigns " +
                        "INNER JOIN characters ON campaigns.id=characters.campaign_id " +
                        "INNER JOIN account_characters ON characters.id=account_characters.character_id " +
                        "INNER JOIN accounts ON account_characters.account_id=accounts.id " +
                        "LEFT JOIN sessions ON campaigns.id=sessions.campaign_id " +
                        "WHERE accounts.username=? GROUP BY campaigns.id " +
                        "ORDER BY sessions.date IS NULL, sessions.date",
                new CampaignBookMapper(), username);
    }

    public List<CampaignBook> getCampaignBooksForDM(String username) {
        return jdbcTemplate.query("SELECT campaigns.*, COUNT(sessions.id) AS session_count, MAX(sessions.date) AS last_played, " +
                        "(SELECT group_concat('{ id: \"' || accounts.username || '\", name: \"' || characters.name || '\" }') " +
                        "FROM characters " +
                        "INNER JOIN account_characters ON characters.id=account_characters.character_id " +
                        "INNER JOIN accounts ON account_characters.account_id = accounts.id " +
                        "WHERE characters.campaign_id=campaigns.id) players " +
                        "FROM campaigns " +
                        "INNER JOIN accounts ON campaigns.dungeon_master=accounts.id " +
                        "LEFT JOIN sessions ON campaigns.id=sessions.campaign_id " +
                        "WHERE accounts.username=? GROUP BY campaigns.id " +
                        "ORDER BY sessions.date IS NULL, sessions.date",
                new CampaignBookMapper(), username);
    }

    public CampaignDTO getCampaignDTOById(String campaignId) {
        return jdbcTemplate.queryForObject("SELECT * FROM campaigns WHERE campaigns.id=?", new CampaignDTOMapper(),
                campaignId);
    }


    public List<CharacterDTO> getCharactersByCampaign(String campaignId) {
        return jdbcTemplate.query("SELECT name, id FROM characters WHERE campaign_id=?",
                new CharacterDTOLimitedMapper(), campaignId);
    }

    public List<CharacterBeing> getCharacterBeingsByCampaign(String campaignId) {
        return jdbcTemplate.query("SELECT characters.name, characters.id, vtm_character_bios.being FROM characters " +
                        "INNER JOIN vtm_character_bios ON characters.id=vtm_character_bios.character_id " +
                        "WHERE campaign_id=?",
                new CharacterBeingMapper(), campaignId);
    }

    public List<CharacterDTO> getPCsByCampaign(String campaignId) {
        return jdbcTemplate.query("SELECT characters.name, characters.id FROM characters INNER JOIN " +
                        "account_characters ON characters.id=account_characters.character_id WHERE campaign_id=?",
                new CharacterDTOLimitedMapper(), campaignId);
    }

    public GameType getGameTypeForCampaign(String campaignId) {
        return GameType.fromString(jdbcTemplate.queryForObject("SELECT game_type FROM campaigns WHERE campaigns.id=?",
                String.class, campaignId));
    }

    public String addCampaign(String accountId, String name, String gameType) {
        String id = UUID.randomUUID().toString();
        jdbcTemplate.update("INSERT INTO campaigns (id, name, game_type, dungeon_master) VALUES (?, ?, ?, ?)", id,
                name, gameType, accountId);
        return id;
    }

}
