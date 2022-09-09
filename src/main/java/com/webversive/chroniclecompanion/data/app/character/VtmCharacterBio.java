package com.webversive.chroniclecompanion.data.app.character;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VtmCharacterBio {
    private String being;
    private String alias;
    private String info;
    private String clan;
    private int generation;
    private int bloodPotency;
    private int apparentAge;
    private int embraced;
    private int born;
    private int experience;
    private String predatorType;
    private String status;
    private String sire;
    private String house;
    private int isGhouled;
    private String boundTo;
    private String touchstoneFor;
    private String retainerFor;
    private String tribe;
}
