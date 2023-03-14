package com.webversive.chroniclecompanion.data.app;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DndRollResults {
    private int diceType;
    private List<Integer> results;
}
