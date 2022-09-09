package com.webversive.chroniclecompanion.data.app;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RollData {
    private int hunger;
    private int total;
    private String player;
    private String alias;
    private String notify;
    private String rollFor;
    private RollResults reroll;
}
