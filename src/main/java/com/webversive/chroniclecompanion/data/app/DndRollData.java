package com.webversive.chroniclecompanion.data.app;

import com.webversive.chroniclecompanion.enums.NotifyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DndRollData {
    private String player;
    private String alias;
    private NotifyType notify;
    private List<DndDiceDetails> diceMap;
}
