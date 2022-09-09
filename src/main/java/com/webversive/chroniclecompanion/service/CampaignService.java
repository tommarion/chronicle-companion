package com.webversive.chroniclecompanion.service;

import com.webversive.chroniclecompanion.data.app.CampaignBook;
import com.webversive.chroniclecompanion.data.app.CampaignData;
import com.webversive.chroniclecompanion.data.sqlite.CampaignDTO;
import com.webversive.chroniclecompanion.service.sql.AccountSQLService;
import com.webversive.chroniclecompanion.service.sql.CampaignSQLService;
import com.webversive.chroniclecompanion.service.sql.NotesSQLService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class CampaignService {

    private final CampaignSQLService campaignSqlService;
    private final AccountSQLService accountSqlService;
    private final NotesSQLService notesSqlService;

    public CampaignService(CampaignSQLService campaignSqlService,
                           AccountSQLService accountSqlService,
                           NotesSQLService notesSqlService) {
        this.campaignSqlService = campaignSqlService;
        this.accountSqlService = accountSqlService;
        this.notesSqlService = notesSqlService;
    }

    public Map<String, CampaignBook> getCampaignsForAccount(String username) {
        List<CampaignBook> campaigns = campaignSqlService.getCampaignBooksForDM(username);
        campaigns.addAll(campaignSqlService.getCampaignBooksWithPlayer(username));

        return campaigns.stream().collect(
                Collectors.toMap(CampaignBook::getName, Function.identity()));
    }

    public CampaignData getCampaignDataById(String user, String campaignId) {
        CampaignDTO campaignDTO = campaignSqlService.getCampaignDTOById(campaignId);

        boolean isDungeonMaster = accountSqlService.isDungeonMaster(campaignId, user);

        CampaignData campaignData = CampaignData.builder()
                .id(campaignDTO.getId())
                .name(campaignDTO.getName())
                .enabled(campaignDTO.isEnabled())
                .sessions(notesSqlService.getSessionsByCampaign(campaignId))
                .admin(isDungeonMaster)
                .build();

        if (isDungeonMaster) {
            campaignData.setNotes(notesSqlService.getAllGeneralNotesByCampaign(campaignId));
        } else {
            campaignData.setNotes(notesSqlService.getGeneralNotesByCampaignAndAccount(campaignId, user));
        }

        return campaignData;
    }
}
