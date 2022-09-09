package com.webversive.chroniclecompanion.data.app.character;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VtmAttributeMentalGroup {
    private int intelligence;
    private int wits;
    private int resolve;
}
