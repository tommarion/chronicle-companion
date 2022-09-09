package com.webversive.chroniclecompanion.enums;

public enum GameType {
    DND("dnd"), VTM("vampire");

    public final String value;

    GameType(String value) {
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
