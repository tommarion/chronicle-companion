package com.webversive.chroniclecompanion.data.app;

import com.webversive.chroniclecompanion.data.sqlite.NoteDTO;
import com.webversive.chroniclecompanion.data.sqlite.SessionDTO;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GeneralSession {
    private List<NoteDTO> notes;
    private List<SessionDTO> sessions;
}
