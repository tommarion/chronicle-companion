package com.webversive.chroniclecompanion.data.app.character;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VtmAttributesGroups {
    private VtmAttributeMentalGroup mental;
    private int mentalValue;
    private VtmAttributeSocialGroup social;
    private int socialValue;
    private VtmAttributePhysicalGroup physical;
    private int physicalValue;
}
