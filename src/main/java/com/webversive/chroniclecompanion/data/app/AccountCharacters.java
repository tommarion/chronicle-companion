package com.webversive.chroniclecompanion.data.app;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class AccountCharacters {
    private Map<String, String> accounts;
    private List<Map<String, String>> characters;
    private Map<String, String> characterAccounts;
}
