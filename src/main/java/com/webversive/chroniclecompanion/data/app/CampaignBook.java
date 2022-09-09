package com.webversive.chroniclecompanion.data.app;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class CampaignBook {
    private String id;
    private String name;
    private String gameType;
    private boolean enabled;
    private String relationshipMapLink;
    private String activeEncounter;
    private Map<String, String> character;
}
