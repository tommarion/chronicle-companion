package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.app.character.Character;
import com.webversive.chroniclecompanion.data.app.character.VtmCharacterBio;
import com.webversive.chroniclecompanion.data.app.character.VtmCharacterSheet;
import com.webversive.chroniclecompanion.data.app.character.VtmTrackers;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

@Slf4j
public class VtmCharacterMapper implements RowMapper<Character> {
    @Override
    public Character mapRow(ResultSet resultSet, int i) throws SQLException {
        return Character.builder()
                .id(resultSet.getString("id"))
                .name(resultSet.getString("name"))
                .bio(VtmCharacterBio.builder()
                        .being(resultSet.getString("being"))
                        .alias(resultSet.getString("alias"))
                        .clan(resultSet.getString("clan"))
                        .generation(resultSet.getInt("generation"))
                        .bloodPotency(resultSet.getInt("blood_potency"))
                        .apparentAge(resultSet.getInt("apparent_age"))
                        .embraced(resultSet.getInt("embraced"))
                        .born(resultSet.getInt("born"))
                        .experience(resultSet.getInt("experience"))
                        .predatorType(resultSet.getString("predator_type"))
                        .status(resultSet.getString("status"))
                        .sire(resultSet.getString("sire"))
                        .house(resultSet.getString("house"))
                        .isGhouled(resultSet.getInt("ghouled"))
                        .boundTo(resultSet.getString("bound_to"))
                        .touchstoneFor(resultSet.getString("touchstone_for"))
                        .retainerFor(resultSet.getString("retainer_for"))
                        .tribe(resultSet.getString("tribe"))
                        .build())
                .bioText(resultSet.getString("bio"))
                .sheet(VtmCharacterSheet.builder()
                        .trackers(VtmTrackers.builder()
                                .healthAggravated(resultSet.getInt("health_aggravated"))
                                .healthSuperficial(resultSet.getInt("health_superficial"))
                                .willpowerAggravated(resultSet.getInt("willpower_aggravated"))
                                .willpowerSuperficial(resultSet.getInt("willpower_superficial"))
                                .humanityMax(resultSet.getInt("humanity_max"))
                                .humanityStains(resultSet.getInt("humanity_stains"))
                                .hunger(resultSet.getInt("hunger"))
                                .build())
                        .build())
                .build();
    }
}
