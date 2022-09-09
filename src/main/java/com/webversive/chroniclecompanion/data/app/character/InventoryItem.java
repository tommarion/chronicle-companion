package com.webversive.chroniclecompanion.data.app.character;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InventoryItem {
    private String description;
    private boolean isArmor;
    private boolean isWeapon;
    private int armorModifier;
    private int weaponModifier;
    private boolean isOnPerson;
    private String location;
    private boolean isFirearm;
    private boolean isMelee;
}
