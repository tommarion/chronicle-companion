package com.webversive.chroniclecompanion.data.app.character;

import com.webversive.chroniclecompanion.data.app.CharacterBeing;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class VtmCharacterSheet {
    private VtmAttributesGroups attributes;
    private VtmSkills skills;
    private VtmTrackers trackers;
    private List<CharacterBeing> retainers;
    private List<CharacterBeing> bloodSlaves;
    private List<CharacterBeing> ghouls;
    private List<CharacterBeing> animals;
    private List<VtmAdvantageFlaw> advantages;
    private List<VtmAdvantageFlaw> flaws;
    private List<String> convictions;
    private List<VtmTouchstones> touchstones;
}
