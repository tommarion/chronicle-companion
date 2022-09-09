package com.webversive.chroniclecompanion.controllers;

import com.webversive.chroniclecompanion.data.app.GeneralSession;
import com.webversive.chroniclecompanion.data.app.SessionNotes;
import com.webversive.chroniclecompanion.data.sqlite.NoteDTO;
import com.webversive.chroniclecompanion.exception.UnauthorizedException;
import com.webversive.chroniclecompanion.service.NoteService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@Slf4j
public class NotesController {

    private final NoteService noteService;

    public NotesController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping("/session/{sessionId}/notes")
    public ResponseEntity<SessionNotes> getCampaigns(@AuthenticationPrincipal User user,
                                                     @PathVariable(value="sessionId") String sessionId) {
        return new ResponseEntity<>(noteService.getNotesForSession(user.getUsername(), sessionId), HttpStatus.OK);
    }

    @PutMapping("/campaign/{campaignId}/sessions/")
    public ResponseEntity<GeneralSession> createSession(@AuthenticationPrincipal User user,
                                                        @PathVariable(value="campaignId") String campaignId) {
        try {
            return new ResponseEntity<>(noteService.createSession(user.getUsername(), campaignId), OK);
        } catch (UnauthorizedException uex) {
            log.error(uex.getMessage(), uex);
        }
        return new ResponseEntity<>(UNAUTHORIZED);
    }

    @PutMapping("/campaign/{campaignId}/notes/")
    public ResponseEntity<GeneralSession> createNote(@AuthenticationPrincipal User user,
                                                     @PathVariable(value="campaignId") String campaignId,
                                                     @RequestBody NoteDTO note) {
        try {
            return new ResponseEntity<>(noteService.createNote(user.getUsername(), campaignId, note), OK);
        } catch (UnauthorizedException uex) {
            log.error(uex.getMessage(), uex);
        }
        return new ResponseEntity<>(UNAUTHORIZED);
    }

    @GetMapping("/campaign/{campaignId}/notes/{noteId}/")
    public ResponseEntity<NoteDTO> getNoteById(@AuthenticationPrincipal User user,
                                               @PathVariable(value="campaignId") String campaignId,
                                               @PathVariable(value="noteId") String noteId) {
        try {
            return new ResponseEntity<>(noteService.getNoteById(user.getUsername(), campaignId, noteId), OK);
        } catch (UnauthorizedException uex) {
            log.error(uex.getMessage(), uex);
        }
        return new ResponseEntity<>(UNAUTHORIZED);
    }
}
