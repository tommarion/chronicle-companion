package com.webversive.chroniclecompanion.data.app;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class RollResultsData {
    private String player;
    private String alias;
    private String notify;
    private Date timestamp;
    private String rollFor;
    private RollResults roll;
    private boolean reroll;
}
