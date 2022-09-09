package com.webversive.chroniclecompanion.data.sqlite;

import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Builder
public class NoteDTO {
    private String id;
    private String sessionId;
    private String campaignId;
    private String accountId;
    private String name;
    private String note;
    private Date date;
    private List<NoteTagDTO> tags;
}
