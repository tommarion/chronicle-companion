package com.webversive.chroniclecompanion.data.app.character;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class InventoryCategories {
    private List<InventoryItem> armor;
    private List<InventoryItem> weapons;
    private List<InventoryItem> misc;
}
