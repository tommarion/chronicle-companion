package com.webversive.chroniclecompanion.data.app;

import com.webversive.chroniclecompanion.enums.NotifyType;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class RollResultsData {
    private String player;
    private String alias;
    private NotifyType notify;
    private Date timestamp;
    private String rollFor;
    private String rollWith;
    private RollResults roll;
    private boolean reroll;
}
