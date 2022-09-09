package com.webversive.chroniclecompanion.util;

import com.webversive.chroniclecompanion.data.sqlite.CharacterDTO;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@Slf4j
public class MapUtil {
    public static Map<String, String> convertObjectToMap(CharacterDTO character) {
        return new HashMap<>(){{
            put("id", character.getId());
            put("name", character.getName());
        }};
    }
}
