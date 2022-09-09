package com.webversive.chroniclecompanion.data.app;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OnlineData {
    private String campaignId;
    private String characterId;
    private String accountId;
}
