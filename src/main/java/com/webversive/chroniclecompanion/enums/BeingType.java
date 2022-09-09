package com.webversive.chroniclecompanion.enums;

public enum BeingType {
    MORTAL("Mortal"), ANIMAL("Animal"), KINDRED("Kindred"), GHOUL("Ghoul");

    public final String value;
    BeingType(String value) {
        this.value = value;
    }
    public static GameType fromString(String text) {
        for (GameType b : GameType.values()) {
            if (b.value.equalsIgnoreCase(text)) {
                return b;
            }
        }
        return null;
    }
}
