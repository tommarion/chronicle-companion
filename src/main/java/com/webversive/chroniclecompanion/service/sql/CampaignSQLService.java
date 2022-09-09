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

@Service
@Slf4j
public class CampaignSQLService {

    private final JdbcTemplate jdbcTemplate;

    public CampaignSQLService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<CampaignBook> getCampaignBooksWithPlayer(String username) {
        return jdbcTemplate.query(
                "SELECT campaigns.*, characters.name, characters.id FROM campaigns INNER JOIN characters ON " +
                        "campaigns.id=characters.campaign_id INNER JOIN account_characters ON " +
                        "characters.id=account_characters.character_id INNER JOIN accounts ON " +
                        "account_characters.account_id=accounts.id WHERE accounts.username=?",
                new CampaignBookMapper(), username);
    }

    public List<CampaignBook> getCampaignBooksForDM(String username) {
        return jdbcTemplate.query("SELECT campaigns.* FROM campaigns INNER JOIN dungeon_master ON " +
                "campaigns.id=dungeon_master.campaign_id INNER JOIN accounts ON " +
                "dungeon_master.account_id=accounts.id WHERE accounts.username=?",
                new CampaignBookMapper(), username);
    }

    public CampaignDTO getCampaignDTOById(String campaignId) {
        return jdbcTemplate.queryForObject("SELECT * FROM campaigns WHERE id=?", new CampaignDTOMapper(), campaignId);
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

}
