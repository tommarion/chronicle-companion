package com.webversive.chroniclecompanion.data.app;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RollResults {
    private List<Integer> regular;
    private List<Integer> hunger;
}
