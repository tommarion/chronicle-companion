package com.webversive.chroniclecompanion.data.app.character;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class VtmDiscipline {
    private String discipline;
    private int level;
    private List<String> powers;
}
