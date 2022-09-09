package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.app.character.VtmAttributeMentalGroup;
import com.webversive.chroniclecompanion.data.app.character.VtmAttributePhysicalGroup;
import com.webversive.chroniclecompanion.data.app.character.VtmAttributeSocialGroup;
import com.webversive.chroniclecompanion.data.app.character.VtmAttributesGroups;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class VtmAttributesMapper implements RowMapper<VtmAttributesGroups> {
    @Override
    public VtmAttributesGroups mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        return VtmAttributesGroups.builder()
                .mental(VtmAttributeMentalGroup.builder()
                        .intelligence(resultSet.getInt("intelligence"))
                        .resolve(resultSet.getInt("resolve"))
                        .wits(resultSet.getInt("wits"))
                        .build())
                .physical(VtmAttributePhysicalGroup.builder()
                        .dexterity(resultSet.getInt("dexterity"))
                        .stamina(resultSet.getInt("stamina"))
                        .strength(resultSet.getInt("strength"))
                        .build())
                .social(VtmAttributeSocialGroup.builder()
                        .charisma(resultSet.getInt("charisma"))
                        .composure(resultSet.getInt("composure"))
                        .manipulation(resultSet.getInt("manipulation"))
                        .build())
                .build();
    }
}
