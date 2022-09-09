package com.webversive.chroniclecompanion.data.sqlite;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class SessionDTO {
    private String id;
    private String campaignId;
    private String name;
    private Date date;
}
