package com.webversive.chroniclecompanion.data.sqlite;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountCharacterDTO {
    private String characterId;
    private String accountId;
}
