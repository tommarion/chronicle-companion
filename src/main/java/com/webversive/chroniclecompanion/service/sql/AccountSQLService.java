package com.webversive.chroniclecompanion.service.sql;

import com.webversive.chroniclecompanion.data.mappers.AccountCharacterDTOMapper;
import com.webversive.chroniclecompanion.data.mappers.AccountDTOMapper;
import com.webversive.chroniclecompanion.data.sqlite.AccountCharacterDTO;
import com.webversive.chroniclecompanion.data.sqlite.AccountDTO;
import com.webversive.chroniclecompanion.enums.DataObjectType;
import com.webversive.chroniclecompanion.exception.DatabaseException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.Objects.nonNull;
import static java.util.UUID.randomUUID;

@Service
public class AccountSQLService {

    private final JdbcTemplate jdbcTemplate;

    public AccountSQLService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean isDungeonMaster(String campaignId, String username) {
        Integer rowCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM campaigns INNER JOIN dungeon_master ON " +
                        "campaigns.id=dungeon_master.campaign_id INNER JOIN accounts ON " +
                        "dungeon_master.account_id=accounts.id WHERE campaigns.id=? AND accounts.username=?",
                Integer.class, campaignId, username);
        return nonNull(rowCount) && rowCount > 0;
    }

    public boolean isDungeonMasterForSession(String sessionId, String username) {
        Integer rowCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM sessions INNER JOIN campaigns ON sessions.campaign_id=campaigns.id " +
                        "INNER JOIN dungeon_master ON campaigns.id=dungeon_master.campaign_id INNER JOIN accounts ON " +
                        "dungeon_master.account_id=accounts.id WHERE sessions.id=? AND accounts.username=?",
                Integer.class, sessionId, username);
        return nonNull(rowCount) && rowCount > 0;
    }


    public List<AccountDTO> getAccounts() {
        return jdbcTemplate.query("SELECT username, id FROM accounts", new AccountDTOMapper());
    }
    public List<AccountCharacterDTO> getCharacterAccounts(String campaignId) {
        return jdbcTemplate.query("SELECT account_characters.character_id, account_characters.account_id FROM " +
                        "account_characters INNER JOIN characters ON account_characters.character_id=characters.id " +
                        "WHERE characters.campaign_id=?",
                new AccountCharacterDTOMapper(), campaignId);
    }

    public String getAccountIdForUsername(String username) {
        return jdbcTemplate.queryForObject("SELECT id FROM accounts WHERE username=?",
                String.class, username);
    }
    public String getUsernameForAccountId(String username) {
        return jdbcTemplate.queryForObject("SELECT username FROM accounts WHERE id=?",
                String.class, username);
    }

    public String getCharacterIdForUsername(String username, String campaignId) {
        try {
            return jdbcTemplate.queryForObject("SELECT characters.id FROM characters INNER JOIN account_characters " +
                            "ON characters.id=account_characters.character_id  INNER JOIN accounts ON " +
                            "account_characters.account_id=accounts.id WHERE accounts.username=? and characters.campaign_id=?",
                    String.class, username, campaignId);
        } catch (EmptyResultDataAccessException erdae) {
            return "DM";
        }
    }

    public boolean getCharacterByUsernameCount(String username, String characterId) {
        try {
            Integer characterCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM characters INNER JOIN account_characters ON " +
                            "characters.id=account_characters.character_id INNER JOIN accounts ON " +
                            "account_characters.account_id=accounts.id WHERE characters.id=? AND accounts.username=?",
                    Integer.class, characterId, username);

            return nonNull(characterCount) && characterCount != 0;
        } catch (EmptyResultDataAccessException erdae) {
            return false;
        }
    }

    public String getCampaignIdByCharacter(String characterId) {
        return jdbcTemplate.queryForObject("SELECT campaign_id FROM characters WHERE id=?", String.class,
                characterId);
    }

    public boolean canUserAccess(DataObjectType type, String username, String dataId) {
        switch (type) {
            case CHARACTER:
                String characterCampaignId = getCampaignIdByCharacter(dataId);
                if (isDungeonMaster(characterCampaignId, username)) {
                    return true;
                }
                return getCharacterByUsernameCount(username, dataId);
            case LOCATION:
            default:
                return false;
        }
    }

    public UserDetails getUserDetailsByUsername(String username) {
        List<String> password = jdbcTemplate.queryForList("SELECT password FROM accounts WHERE username=?",
                String.class, username);
        List<String> authority = jdbcTemplate.queryForList("SELECT authority FROM authorities WHERE username=?",
                String.class, username);
        if (password.isEmpty() || authority.isEmpty()) {
            return null;
        }
        return User.builder()
                .username(username)
                .password(password.get(0))
                .authorities(authority.get(0))
                .build();
    }

    public void addToAccounts(String username, String encodedPass) {
        try {
            if (jdbcTemplate.update("INSERT INTO accounts (id, username, password) VALUES (?, ?, ?)",
                    randomUUID().toString(), username, encodedPass) != 1) {
                throw new DatabaseException("Accounts table in database was not updated.");
            }
        } catch (Exception ex) {
            throw new DatabaseException("Login credentials were not added to accounts table", ex);
        }
    }
}
