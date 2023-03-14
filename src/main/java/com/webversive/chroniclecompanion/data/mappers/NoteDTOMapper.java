package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.sqlite.NoteDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import static com.webversive.chroniclecompanion.util.DateUtil.getDateFromSQLString;

@Slf4j
public class NoteDTOMapper implements RowMapper<NoteDTO> {
    @Override
    public NoteDTO mapRow(ResultSet resultSet, int i) throws SQLException {
        String author = null;
        if (resultSet.getMetaData().getColumnCount() == 8) {
            author = resultSet.getString("author");
        }
        return NoteDTO.builder()
                .id(resultSet.getString("id"))
                .sessionId(resultSet.getString("session_id"))
                .campaignId(resultSet.getString("campaign_id"))
                .accountId(resultSet.getString("account_id"))
                .name(resultSet.getString("name"))
                .note(resultSet.getString("note"))
                .date(getDateFromSQLString(resultSet.getString("date")))
                .author(author)
                .build();
    }
}
