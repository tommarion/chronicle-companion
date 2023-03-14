package com.webversive.chroniclecompanion.service;

import com.webversive.chroniclecompanion.data.app.CampaignBook;
import com.webversive.chroniclecompanion.data.app.CampaignData;
import com.webversive.chroniclecompanion.data.app.CreateCampaignData;
import com.webversive.chroniclecompanion.data.sqlite.CampaignDTO;
import com.webversive.chroniclecompanion.data.sqlite.SessionDTO;
import com.webversive.chroniclecompanion.enums.GameType;
import com.webversive.chroniclecompanion.service.sql.AccountSQLService;
import com.webversive.chroniclecompanion.service.sql.CampaignSQLService;
import com.webversive.chroniclecompanion.service.sql.NotesSQLService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class CampaignService {

    private final CampaignSQLService campaignSqlService;
    private final AccountSQLService accountSqlService;
    private final NotesSQLService notesSqlService;
    private final NoteService noteService;

    public CampaignService(CampaignSQLService campaignSqlService,
                           AccountSQLService accountSqlService,
                           NotesSQLService notesSqlService,
                           NoteService noteService) {
        this.campaignSqlService = campaignSqlService;
        this.accountSqlService = accountSqlService;
        this.notesSqlService = notesSqlService;
        this.noteService = noteService;
    }

    public List<CampaignBook> getCampaignsForAccount(String username) {
        List<CampaignBook> campaigns = campaignSqlService.getCampaignBooksForDM(username);
        campaigns.addAll(campaignSqlService.getCampaignBooksWithPlayer(username));
        return campaigns;
    }

    public CampaignData getCampaignDataById(String user, String campaignId) {
        CampaignDTO campaignDTO = campaignSqlService.getCampaignDTOById(campaignId);

        boolean isDungeonMaster = accountSqlService.isDungeonMaster(campaignId, user);
        log.info("isDungeonMaster: " + isDungeonMaster);
        List<SessionDTO> sessions = notesSqlService.getSessionsByCampaign(campaignId);
        CampaignData campaignData = CampaignData.builder()
                .id(campaignDTO.getId())
                .name(campaignDTO.getName())
                .enabled(campaignDTO.isEnabled())
                .sessions(sessions)
                .admin(isDungeonMaster)
                .gameType(campaignDTO.getGameType())
                .build();

        if (campaignDTO.getGameType().equals(GameType.VTM.name())) {
            campaignData.setRelationshipMapLink(campaignDTO.getRelationshipMapLink());
        }
        if (isDungeonMaster) {
            campaignData.setNotes(notesSqlService.getAllGeneralNotesByCampaign(campaignId));
        } else {
            campaignData.setNotes(notesSqlService.getGeneralNotesByCampaignAndAccount(campaignId, user));
        }

        if (!sessions.isEmpty()) {
            campaignData.setSessionContent(noteService.getNotesForSession(user, sessions.get(0).getId()));
        }

        return campaignData;
    }

    public String createCampaign(String user, CreateCampaignData campaignData) {
        String accountId = accountSqlService.getAccountIdForUsername(user);
        return campaignSqlService.addCampaign(accountId, campaignData.getName(), campaignData.getGameType());
    }
}
