package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.app.character.InventoryItem;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class InventoryMapper implements RowMapper<InventoryItem> {
    @Override
    public InventoryItem mapRow(ResultSet resultSet, int i) throws SQLException {
        return InventoryItem.builder()
                .description(resultSet.getString("description"))
                .isArmor(resultSet.getBoolean("is_armor"))
                .isWeapon(resultSet.getBoolean("is_weapon"))
                .isFirearm(resultSet.getBoolean("is_firearm"))
                .isMelee(resultSet.getBoolean("is_melee"))
                .isOnPerson(resultSet.getBoolean("on_person"))
                .location(resultSet.getString("location"))
                .armorModifier(resultSet.getInt("armor_modifier"))
                .weaponModifier(resultSet.getInt("weapon_modifier"))
                .build();
    }
}
