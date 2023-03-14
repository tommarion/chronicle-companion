package com.webversive.chroniclecompanion.service;

import com.webversive.chroniclecompanion.data.app.GeneralSession;
import com.webversive.chroniclecompanion.data.app.SessionNotes;
import com.webversive.chroniclecompanion.data.sqlite.NoteDTO;
import com.webversive.chroniclecompanion.enums.DataObjectType;
import com.webversive.chroniclecompanion.exception.UnauthorizedException;
import com.webversive.chroniclecompanion.service.sql.AccountSQLService;
import com.webversive.chroniclecompanion.service.sql.NotesSQLService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Objects;

import static java.util.Objects.isNull;

@Service
@Slf4j
public class NoteService {

    private final NotesSQLService notesSqlService;
    private final AccountSQLService accountSqlService;

    public NoteService(NotesSQLService notesSqlService,
                       AccountSQLService accountSqlService) {
        this.notesSqlService = notesSqlService;
        this.accountSqlService = accountSqlService;
    }

    public SessionNotes getNotesForSession(String username, String sessionId) {
        SessionNotes sessionNotes = SessionNotes.builder()
                .session(notesSqlService.getSessionById(sessionId))
                .build();
        if (accountSqlService.isDungeonMasterForSession(sessionId, username)) {
            sessionNotes.setNotes(notesSqlService.getNotesBySession(sessionId));
        } else {
            sessionNotes.setNotes(notesSqlService.getNotesBySessionAndAccount(username, sessionId));
        }
        return sessionNotes;
    }

    public GeneralSession getNotesForCampaign(String username, String campaignId) {
        return GeneralSession.builder()
                .notes(notesSqlService.getGeneralNotesByCampaignAndAccount(campaignId, username))
                .sessions(notesSqlService.getSessionsByCampaign(campaignId))
                .build();
    }

    public GeneralSession createSession(String username, String campaignId)
            throws UnauthorizedException {
        if (accountSqlService.isDungeonMaster(campaignId, username)) {
            if (notesSqlService.createSession(campaignId)) {
                return getNotesForCampaign(username, campaignId);
            }
            return null;
        }
        throw new UnauthorizedException("Not authorized to perform this operation!");
    }

    public boolean upsertNote(String username, String campaignId, NoteDTO note) throws UnauthorizedException{
        if (!StringUtils.hasText(note.getId()) || Objects.isNull(notesSqlService.getNoteById(note.getId()))) {
            String accountId = accountSqlService.getAccountIdForUsername(username);
            return notesSqlService.createNote(accountId, campaignId, note);
        } else {
            if (accountSqlService.canUserAccess(DataObjectType.NOTE, username, note.getId())) {
                return notesSqlService.updateNote(note);
            }
            throw new UnauthorizedException("Not authorized to access this note!");
        }
    }

    public boolean removeNote(String username, String noteId) throws UnauthorizedException{
        if (accountSqlService.canUserAccess(DataObjectType.NOTE, username, noteId)) {
            return notesSqlService.deleteNote(noteId);
        }
        throw new UnauthorizedException("Not authorized to access this note!");
    }

    public NoteDTO getNoteById(String username, String noteId)
            throws UnauthorizedException {
        boolean authorized = accountSqlService.canUserAccess(DataObjectType.NOTE, username, noteId);
        final NoteDTO noteDTO = notesSqlService.getNoteById(noteId);
        if (isNull(noteDTO) || authorized ||
                noteDTO.getAccountId().equals(accountSqlService.getAccountIdForUsername(username))) {
            return noteDTO;
        }
        throw new UnauthorizedException("Not authorized to perform this operation!");
    }

}
