package com.webversive.chroniclecompanion.data.sqlite;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CharacterDTO {
    private String id;
    private String name;
    private String being;
}
