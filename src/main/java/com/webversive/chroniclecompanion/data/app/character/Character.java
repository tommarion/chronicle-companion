package com.webversive.chroniclecompanion.data.app.character;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Character {
    private String id;
    private String name;
    private VtmCharacterBio bio;
    private VtmCharacterSheet sheet;
    private InventoryCategories inventory;
}
