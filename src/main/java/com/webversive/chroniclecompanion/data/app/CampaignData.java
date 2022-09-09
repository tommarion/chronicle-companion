package com.webversive.chroniclecompanion.data.app;

import com.webversive.chroniclecompanion.data.sqlite.NoteDTO;
import com.webversive.chroniclecompanion.data.sqlite.SessionDTO;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CampaignData {
    private String id;
    private String name;
    private boolean enabled;
    private List<NoteDTO> notes;
    private List<SessionDTO> sessions;
    private String relationshipMapLink;
    private String activeEncounter;
    private boolean admin;
}
