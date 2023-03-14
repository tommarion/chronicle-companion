package com.webversive.chroniclecompanion.data.app.character;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class Character {
    private String id;
    private String name;
    private VtmCharacterBio bio;
    private String bioText;
    private VtmCharacterSheet sheet;
    private InventoryCategories inventory;
    private List<VtmDiscipline> disciplines;
}
