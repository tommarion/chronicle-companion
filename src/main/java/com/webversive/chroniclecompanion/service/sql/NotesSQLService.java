package com.webversive.chroniclecompanion.service.sql;

import com.webversive.chroniclecompanion.data.mappers.NoteDTOMapper;
import com.webversive.chroniclecompanion.data.mappers.SessionDTOMapper;
import com.webversive.chroniclecompanion.data.sqlite.NoteDTO;
import com.webversive.chroniclecompanion.data.sqlite.NoteTagDTO;
import com.webversive.chroniclecompanion.data.sqlite.SessionDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.Objects;

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
        return jdbcTemplate.query("SELECT notes.* FROM notes " +
                        "INNER JOIN accounts ON notes.account_id=accounts.id " +
                        "WHERE notes.session_id IS NULL AND notes.campaign_id=? AND " +
                        "accounts.username=? ORDER BY notes.date DESC",
                new NoteDTOMapper(), campaignId, username);
    }

    public List<NoteDTO> getAllGeneralNotesByCampaign(String campaignId) {
        return jdbcTemplate.query("SELECT notes.*, characters.name AS author FROM notes " +
                        "LEFT JOIN account_characters ON notes.account_id=account_characters.account_id " +
                        "LEFT JOIN characters ON account_characters.character_id=characters.id " +
                        "WHERE notes.session_id IS NULL AND notes.campaign_id=? ORDER BY date DESC",
                new NoteDTOMapper(), campaignId);
    }

    public List<SessionDTO> getSessionsByCampaign(String campaignId) {
        log.info(campaignId);
        return jdbcTemplate.query("SELECT * FROM sessions WHERE campaign_id=? ORDER BY date DESC",
                new SessionDTOMapper(), campaignId);
    }

    public SessionDTO getSessionById(String sessionId) {
        return jdbcTemplate.queryForObject("SELECT * FROM sessions WHERE id=?",
                new SessionDTOMapper(), sessionId);
    }

    public List<NoteDTO> getNotesBySession(String sessionId) {
        return jdbcTemplate.query("SELECT notes.*, characters.name AS author FROM notes " +
                        "LEFT JOIN account_characters ON notes.account_id=account_characters.account_id " +
                        "LEFT JOIN characters ON account_characters.character_id=characters.id " +
                        "WHERE notes.session_id=? ORDER BY date DESC",
                new NoteDTOMapper(), sessionId);
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
    public boolean createNote(String accountId, String campaignId, NoteDTO note) {
        final String noteId = randomUUID().toString();
        createNoteTags(noteId, note.getTags());
        return jdbcTemplate.update("INSERT INTO notes (id, session_id, campaign_id, account_id, name, note, date) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?)", noteId, note.getSessionId(), campaignId, accountId, note.getName(),
                note.getNote(), getCurrentDate()) != 0;
    }

    @Transactional
    public boolean updateNote(NoteDTO note) {
        removeNoteTags(note.getId());
        createNoteTags(note.getId(), note.getTags());
        return jdbcTemplate.update("UPDATE notes SET name=?, note=? WHERE notes.id=?", note.getName(),
                note.getNote(), note.getId()) != 0;
    }

    @Transactional
    public boolean deleteNote(String noteId) {
        removeNoteTags(noteId);
        return jdbcTemplate.update("DELETE FROM notes WHERE notes.id=?", noteId) == 1;
    }

    public void removeNoteTags(String noteId) {
        jdbcTemplate.update("DELETE FROM notes_tags WHERE note_id=?", noteId);
    }

    public void createNoteTags(String noteId, List<NoteTagDTO> noteTags) {
        jdbcTemplate.batchUpdate("INSERT INTO notes_tags (note_id, tag_type, tag_id) VALUES (?, ?, ?)",
                new BatchPreparedStatementSetter() {
                    @Override
                    public void setValues(PreparedStatement ps, int i) throws SQLException {
                        ps.setString(1, noteId);
                        ps.setString(2, noteTags.get(i).getType());
                        ps.setString(3, noteTags.get(i).getId());
                    }

                    @Override
                    public int getBatchSize() {
                        return Objects.isNull(noteTags) ? 0 : noteTags.size();
                    }
                });
    }

    public NoteDTO getNoteById(String noteId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM notes WHERE id=?", new NoteDTOMapper(), noteId);
        } catch (Exception ex) {
            return null;
        }
    }
}
