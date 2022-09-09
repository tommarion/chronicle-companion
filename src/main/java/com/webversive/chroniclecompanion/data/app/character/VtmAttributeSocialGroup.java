package com.webversive.chroniclecompanion.data.app.character;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VtmAttributeSocialGroup {
    private int charisma;
    private int manipulation;
    private int composure;
}
