package com.webversive.chroniclecompanion.data.app;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OnlineStatus {
    private String id;
    private boolean status;
}
