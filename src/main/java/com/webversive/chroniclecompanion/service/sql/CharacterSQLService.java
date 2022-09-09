package com.webversive.chroniclecompanion.service.sql;

import com.webversive.chroniclecompanion.data.app.CharacterBeing;
import com.webversive.chroniclecompanion.data.app.character.Character;
import com.webversive.chroniclecompanion.data.app.character.InventoryItem;
import com.webversive.chroniclecompanion.data.app.character.VtmAdvantageFlaw;
import com.webversive.chroniclecompanion.data.app.character.VtmAttributesGroups;
import com.webversive.chroniclecompanion.data.app.character.VtmSkills;
import com.webversive.chroniclecompanion.data.app.character.VtmTouchstones;
import com.webversive.chroniclecompanion.data.mappers.CharacterBeingMapper;
import com.webversive.chroniclecompanion.data.mappers.InventoryMapper;
import com.webversive.chroniclecompanion.data.mappers.VtmAltAttributesMapper;
import com.webversive.chroniclecompanion.data.mappers.VtmAttributesMapper;
import com.webversive.chroniclecompanion.data.mappers.VtmCharacterAdvantageFlawMapper;
import com.webversive.chroniclecompanion.data.mappers.VtmCharacterMapper;
import com.webversive.chroniclecompanion.data.mappers.VtmSkillsMapper;
import com.webversive.chroniclecompanion.data.mappers.VtmTouchstonesMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class CharacterSQLService {

    private final JdbcTemplate jdbcTemplate;

    public CharacterSQLService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String getCharacterNameForUsername(String username, String campaignId) {
        try {
            return jdbcTemplate.queryForObject("SELECT characters.name FROM characters INNER JOIN account_characters " +
                            "ON characters.id=account_characters.character_id  INNER JOIN accounts ON " +
                            "account_characters.account_id=accounts.id WHERE accounts.username=? and characters.campaign_id=?",
                    String.class, username, campaignId);
        } catch (EmptyResultDataAccessException erdae) {
            return "DM";
        }
    }

    public String getCharacterNameForCharacterId(String characterId) {
        try {
            return jdbcTemplate.queryForObject("SELECT characters.name FROM characters  WHERE characters.id=?",
                    String.class, characterId);
        } catch (EmptyResultDataAccessException erdae) {
            return "DM";
        }
    }

    public VtmAttributesGroups getAttributesByCharacterId(String characterId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM vtm_attributes WHERE character_id=?",
                    new VtmAttributesMapper(), characterId);
        } catch (EmptyResultDataAccessException erdae) {
            try {
                return jdbcTemplate.queryForObject("SELECT * FROM vtm_alt_attributes WHERE character_id=?",
                        new VtmAltAttributesMapper(), characterId);
            } catch (EmptyResultDataAccessException erdae2) {
                return null;
            }
        }
    }

    public VtmSkills getSkillsByCharacterId(String characterId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM vtm_skills WHERE character_id=?",
                    new VtmSkillsMapper(), characterId);
        } catch (EmptyResultDataAccessException erdae) {
            return null;
        }
    }

    public List<VtmAdvantageFlaw> getAdvantagesByCharacterId(String characterId) {
        return jdbcTemplate.query("SELECT * FROM advantages WHERE character_id=?",
                new VtmCharacterAdvantageFlawMapper(), characterId);
    }

    public List<VtmAdvantageFlaw> getFlawsByCharacterId(String characterId) {
        return jdbcTemplate.query("SELECT * FROM flaws WHERE character_id=?",
                new VtmCharacterAdvantageFlawMapper(), characterId);
    }

    public List<String> getConvictionsByCharacterId(String characterId) {
        return jdbcTemplate.queryForList("SELECT name FROM convictions WHERE character_id=?",
                String.class, characterId);
    }

    public List<VtmTouchstones> getTouchstonesByCharacterId(String characterId) {
        return jdbcTemplate.query("SELECT * FROM touchstones WHERE character_id=?",
                new VtmTouchstonesMapper(), characterId);
    }

    public List<CharacterBeing> getRetainersByCharacterId(String characterId) {
        return jdbcTemplate.query("SELECT * FROM characters INNER JOIN vtm_character_bios ON " +
                        "characters.id=vtm_character_bios.character_id WHERE vtm_character_bios.retainer_for=?",
                new CharacterBeingMapper(), characterId);
    }

    public List<CharacterBeing> getBloodSlavesByCharacterId(String characterId, String beingType) {
        return jdbcTemplate.query("SELECT * FROM characters INNER JOIN vtm_character_bios ON " +
                        "characters.id=vtm_character_bios.character_id WHERE vtm_character_bios.bound_to=? AND " +
                        "vtm_character_bios.being=?",
                new CharacterBeingMapper(), characterId, beingType);
    }

    public List<InventoryItem> getInventoryByCharacterId(String characterId) {
        return jdbcTemplate.query("SELECT * FROM vtm_inventory WHERE character_id=?",
                new InventoryMapper(), characterId);
    }

    public Character getVtmCharacterById(String characterId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM characters INNER JOIN " +
                            "vtm_character_bios ON characters.id=vtm_character_bios.character_id INNER JOIN " +
                            "vtm_trackers ON characters.id=vtm_trackers.character_id WHERE characters.id=?",
                    new VtmCharacterMapper(), characterId);

        } catch (EmptyResultDataAccessException erdae) {
            log.error("Unable to find character data for id: {}", characterId);
            return null;
        }
    }
}
