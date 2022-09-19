package com.webversive.chroniclecompanion.data.app;

import com.webversive.chroniclecompanion.enums.NotifyType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RollData {
    private int hunger;
    private int total;
    private String player;
    private String alias;
    private NotifyType notify;
    private String rollFor;
    private RollResults reroll;
}
