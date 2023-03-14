package com.webversive.chroniclecompanion.service.sql;

import com.webversive.chroniclecompanion.data.sqlite.LocationDTO;
import com.webversive.chroniclecompanion.enums.GameType;
import com.webversive.chroniclecompanion.exception.DatabaseException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class LocationSQLService {

    private final JdbcTemplate jdbcTemplate;

    public LocationSQLService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<LocationDTO> getVtmLocationsByCampaign(String campaignId) {
        return jdbcTemplate.query("SELECT * FROM vtm_locations WHERE chronicle_id=?",
                (rs, rowNum) -> LocationDTO.builder()
                        .id(rs.getString("id"))
                        .name(rs.getString("name"))
                        .build(), campaignId);
    }
    public List<LocationDTO> getVtmLocationsByCampaignAndAccount(String campaignId, String username) {
        return jdbcTemplate.query("SELECT vtm_locations.* FROM vtm_locations " +
                        "INNER JOIN asset_access ON vtm_locations.id=asset_access.asset_id " +
                        "INNER JOIN accounts ON asset_access.account_id=accounts.id " +
                        "WHERE vtm_locations.chronicle_id=? AND accounts.username=?",
                (rs, rowNum) -> LocationDTO.builder()
                        .id(rs.getString("id"))
                        .name(rs.getString("name"))
                        .build(), campaignId, username);
    }

    public GameType getGameTypeByLocationId(String locationId) {
        try {
            return GameType.fromString(jdbcTemplate.queryForObject("SELECT campaigns.game_type FROM campaigns " +
                    "INNER JOIN vtm_locations ON campaigns.id=vtm_locations.chronicle_id " +
                    "WHERE vtm_locations.id=?", String.class, locationId));

        } catch (Exception ex) {
            throw new DatabaseException("Unable to find location data for this locationId", ex);
        }
    }

    public LocationDTO getVtmLocationById(String locationId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM vtm_locations WHERE id=?",
                    (rs, rowNum) -> LocationDTO.builder()
                            .id(rs.getString("id"))
                            .name(rs.getString("name"))
                            .address(rs.getString("address"))
                            .description(rs.getString("description"))
                            .build(),
                    locationId);
        } catch (Exception ex) {
            throw new DatabaseException("Unable to find location data for this locationId", ex);
        }
    }

}
