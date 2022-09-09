package com.webversive.chroniclecompanion.data.app.character;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VtmTrackers {
    private int healthAggravated;
    private int healthSuperficial;
    private int willpowerAggravated;
    private int willpowerSuperficial;
    private int humanityMax;
    private int humanityStains;
    private int hunger;
}
