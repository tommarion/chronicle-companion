package com.webversive.chroniclecompanion.data.app.character;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VtmAttributePhysicalGroup {
    private int strength;
    private int dexterity;
    private int stamina;
}
