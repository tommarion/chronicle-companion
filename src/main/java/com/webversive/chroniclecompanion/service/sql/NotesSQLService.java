package com.webversive.chroniclecompanion.service.sql;

import com.webversive.chroniclecompanion.data.mappers.NoteDTOMapper;
import com.webversive.chroniclecompanion.data.mappers.SessionDTOMapper;
import com.webversive.chroniclecompanion.data.sqlite.NoteDTO;
import com.webversive.chroniclecompanion.data.sqlite.NoteTagDTO;
import com.webversive.chroniclecompanion.data.sqlite.SessionDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.webversive.chroniclecompanion.util.DateUtil.getCurrentDate;
import static java.util.UUID.randomUUID;

@Service
@Slf4j
public class NotesSQLService {
    private final JdbcTemplate jdbcTemplate;
    private final AccountSQLService accountSqlService;

    public NotesSQLService(JdbcTemplate jdbcTemplate,
                           AccountSQLService accountSqlService) {
        this.jdbcTemplate = jdbcTemplate;
        this.accountSqlService = accountSqlService;
    }

    public List<NoteDTO> getGeneralNotesByCampaignAndAccount(String campaignId, String username) {
        return jdbcTemplate.query("SELECT notes.* FROM notes INNER JOIN accounts ON " +
                        "notes.account_id=accounts.id WHERE notes.session_id IS NULL AND notes.campaign_id=? AND " +
                        "accounts.username=? ORDER BY notes.date DESC",
                new NoteDTOMapper(), campaignId, username);
    }

    public List<NoteDTO> getAllGeneralNotesByCampaign(String campaignId) {
        return jdbcTemplate.query("SELECT * FROM notes WHERE session_id IS NULL AND campaign_id=? ORDER BY date DESC",
                new NoteDTOMapper(), campaignId);
    }

    public List<SessionDTO> getSessionsByCampaign(String campaignId) {
        return jdbcTemplate.query("SELECT * FROM sessions WHERE campaign_id=? ORDER BY date DESC", new SessionDTOMapper(), campaignId);
    }

    public SessionDTO getSessionById(String sessionId) {
        return jdbcTemplate.queryForObject("SELECT * FROM sessions WHERE id=?",
                new SessionDTOMapper(), sessionId);
    }

    public List<NoteDTO> getNotesBySession(String sessionId) {
        return jdbcTemplate.query("SELECT * FROM notes WHERE session_id=? ORDER BY date DESC", new NoteDTOMapper(), sessionId);
    }

    public List<NoteDTO> getNotesBySessionAndAccount(String username, String sessionId) {
        return jdbcTemplate.query("SELECT notes.* FROM notes INNER JOIN accounts ON " +
                        "notes.account_id=accounts.id WHERE session_id=? and accounts.username=? ORDER BY notes.date DESC",
                new NoteDTOMapper(), sessionId, username);
    }
    public boolean createSession(String campaignId) {
        return jdbcTemplate.update("INSERT INTO sessions (id, campaign_id, date) VALUES (?, ?, ?)",
                randomUUID().toString(), campaignId, getCurrentDate()) != 0;
    }

    @Transactional
    public boolean createNote(String username, String campaignId, NoteDTO note) {
        final String accountId = accountSqlService.getAccountIdForUsername(username);
        final String noteId = randomUUID().toString();
        note.getTags().forEach(tag -> createNoteTag(noteId, tag));
        return jdbcTemplate.update("INSERT INTO notes (id, session_id, campaign_id, account_id, name, note, date) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?)", noteId, note.getSessionId(), campaignId, accountId, note.getName(),
                note.getNote(), getCurrentDate()) != 0;
    }


    public void createNoteTag(String noteId, NoteTagDTO noteTag) {
        jdbcTemplate.update("INSERT INTO notes_tags (note_id, tag_type, tag_id) VALUES (?, ?, ?)",
                noteId, noteTag.getType(), noteTag.getId());
    }

    public NoteDTO getNoteById(String noteId) {
        return jdbcTemplate.queryForObject("SELECT * FROM notes WHERE id=?", new NoteDTOMapper(), noteId);
    }
}
