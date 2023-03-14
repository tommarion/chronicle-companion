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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
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

    @PutMapping("/campaign/{campaignId}/sessions")
    public ResponseEntity<GeneralSession> createSession(@AuthenticationPrincipal User user,
                                                        @PathVariable(value="campaignId") String campaignId) {
        try {
            return new ResponseEntity<>(noteService.createSession(user.getUsername(), campaignId), OK);
        } catch (UnauthorizedException uex) {
            log.error(uex.getMessage(), uex);
        }
        return new ResponseEntity<>(UNAUTHORIZED);
    }

    @PutMapping("/campaign/{campaignId}/notes")
    public ResponseEntity<String> createNote(@AuthenticationPrincipal User user,
                                                     @PathVariable(value="campaignId") String campaignId,
                                                     @RequestBody NoteDTO note) {
        try {
            if (noteService.upsertNote(user.getUsername(), campaignId, note)) {
                return new ResponseEntity<>("Note created", OK);
            }
            return new ResponseEntity<>("Unable to create or edit note", BAD_REQUEST);
        } catch (UnauthorizedException ue) {
            return new ResponseEntity<>("Unable to create or edit note", UNAUTHORIZED);
        }
    }
    @DeleteMapping("/notes/{noteId}")
    public ResponseEntity<String> removeNote(@AuthenticationPrincipal User user,
                                             @PathVariable String noteId) {
        try {
            if (noteService.removeNote(user.getUsername(), noteId)) {
                return new ResponseEntity<>("Note removed", OK);
            }
            return new ResponseEntity<>("Unable to remove note", BAD_REQUEST);
        } catch (UnauthorizedException ue) {
            return new ResponseEntity<>("Unable to remove note", UNAUTHORIZED);
        }
    }

    @GetMapping("/notes/{noteId}")
    public ResponseEntity<NoteDTO> getNoteById(@AuthenticationPrincipal User user,
                                               @PathVariable(value="noteId") String noteId) {
        try {
            return new ResponseEntity<>(noteService.getNoteById(user.getUsername(), noteId), OK);
        } catch (UnauthorizedException uex) {
            log.error(uex.getMessage(), uex);
        }
        return new ResponseEntity<>(UNAUTHORIZED);
    }
}
