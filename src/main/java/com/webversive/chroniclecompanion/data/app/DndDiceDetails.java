package com.webversive.chroniclecompanion.data.app;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DndDiceDetails {
    private int type;
    private int value;
    private int modifier;
}
