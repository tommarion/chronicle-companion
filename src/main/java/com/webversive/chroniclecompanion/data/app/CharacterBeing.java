package com.webversive.chroniclecompanion.data.app;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CharacterBeing {
    private String id;
    private String name;
    private String being;
}
