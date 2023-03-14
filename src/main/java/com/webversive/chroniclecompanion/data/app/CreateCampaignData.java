package com.webversive.chroniclecompanion.data.app;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCampaignData {
    private String name;
    private String gameType;
}
