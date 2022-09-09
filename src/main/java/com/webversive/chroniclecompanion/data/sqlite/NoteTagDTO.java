package com.webversive.chroniclecompanion.data.sqlite;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NoteTagDTO {
    private String id;
    private String type;
}
