package com.webversive.chroniclecompanion.data.sqlite;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountDTO {
    private String id;
    private String username;
}
