package com.webversive.chroniclecompanion.data.app;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CampaignBook {
    private String id;
    private String name;
    private String gameType;
    private boolean enabled;
    private String relationshipMapLink;
    private String activeEncounter;
    private CharacterBeing character;
    private List<CharacterBeing> players;
    private int sessions;
    private String lastPlayed;
}
