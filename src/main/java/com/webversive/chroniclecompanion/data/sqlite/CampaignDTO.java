package com.webversive.chroniclecompanion.data.sqlite;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CampaignDTO {
    private String id;
    private String name;
    private String gameType;
    private boolean enabled;
    private String relationshipMapLink;
    private String activeEncounter;
}
