package com.webversive.chroniclecompanion.data.app.character;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VtmAdvantageFlaw {
    private String name;
    private int level;
    private String type;
}
