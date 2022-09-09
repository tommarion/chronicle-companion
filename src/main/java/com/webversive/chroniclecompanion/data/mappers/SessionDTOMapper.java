package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.sqlite.SessionDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import static com.webversive.chroniclecompanion.util.DateUtil.getDateFromSQLString;

@Slf4j
public class SessionDTOMapper implements RowMapper<SessionDTO> {
    @Override
    public SessionDTO mapRow(ResultSet resultSet, int i) throws SQLException {
        return SessionDTO.builder()
                .id(resultSet.getString("id"))
                .campaignId(resultSet.getString("campaign_id"))
                .name(resultSet.getString("name"))
                .date(getDateFromSQLString(resultSet.getString("date")))
                .build();
    }
}
