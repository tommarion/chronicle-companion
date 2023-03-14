package com.webversive.chroniclecompanion.data.app;

import com.webversive.chroniclecompanion.enums.NotifyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RollData {
    private int hunger;
    private int total;
    private String player;
    private String alias;
    private NotifyType notify;
    private String rollFor;
    private String rollWith;
    private RollResults reroll;
}
