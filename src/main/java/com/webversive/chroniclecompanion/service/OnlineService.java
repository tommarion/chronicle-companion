package com.webversive.chroniclecompanion.service;

import com.webversive.chroniclecompanion.data.app.OnlineData;
import com.webversive.chroniclecompanion.data.app.OnlineStatus;
import com.webversive.chroniclecompanion.data.sqlite.AccountCharacterDTO;
import com.webversive.chroniclecompanion.enums.GameType;
import com.webversive.chroniclecompanion.service.sql.AccountSQLService;
import com.webversive.chroniclecompanion.service.sql.CampaignSQLService;
import com.webversive.chroniclecompanion.service.sql.CharacterSQLService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Objects.nonNull;

@Service
@Slf4j
public class OnlineService {

    private static final Map<String, OnlineData> SOCKET_DATA = new HashMap<>();
    private final AccountSQLService accountSqlService;
    private final CharacterSQLService characterSqlService;
    private final CampaignSQLService campaignSqlService;

    public OnlineService(AccountSQLService accountSqlService,
                         CharacterSQLService characterSqlService,
                         CampaignSQLService campaignSqlService) {
        this.accountSqlService = accountSqlService;
        this.characterSqlService = characterSqlService;
        this.campaignSqlService = campaignSqlService;
    }

    public void addTokenToSocketData(String token, OnlineData onlineData) {
        // First remove any existing entry for character
        String removeValue = null;
        for (String key : SOCKET_DATA.keySet()) {
            if (SOCKET_DATA.get(key).getAccountId().equals(onlineData.getAccountId())) {
                removeValue = key;
            }
        }
        if (nonNull(removeValue)) {
            SOCKET_DATA.remove(removeValue);
        }
        SOCKET_DATA.put(token, onlineData);
    }

    public OnlineData getOnlineDataByToken(String token) {
        return SOCKET_DATA.get(token);
    }

    public OnlineStatus getOnlineDataByAccountId(String accountId, String characterId) {
        log.info("SocketData: {}", SOCKET_DATA);
        return OnlineStatus.builder()
                .status(SOCKET_DATA.values().stream().anyMatch(v -> v.getAccountId().equals(accountId)))
                .id(characterId)
                .build();
    }

    public Map<String, OnlineStatus> getOnlineStatusByToken(String token) {
        OnlineData onlineData = getOnlineDataByToken(token);
        String username = accountSqlService.getUsernameForAccountId(onlineData.getAccountId());
        Map<String, OnlineStatus> onlineStatus = new HashMap<>() {{
            put("Storyteller", getOnlineDataByAccountId(accountSqlService.getAccountIdForUsername("storyteller"), "Storyteller"));
        }};
        if (accountSqlService.isDungeonMaster(onlineData.getCampaignId(), username)) {
            List<AccountCharacterDTO> accountCharacters = new ArrayList<>() {{
                addAll(accountSqlService.getCharacterAccounts(onlineData.getCampaignId()));
            }};
            accountCharacters.forEach(c ->
                    onlineStatus.put(characterSqlService.getCharacterNameForCharacterId(c.getCharacterId()),
                            getOnlineDataByAccountId(c.getAccountId(), c.getCharacterId()))
            );
        } else {
            return new HashMap<>(){{
                put(characterSqlService.getCharacterNameForUsername(username, onlineData.getCampaignId()),
                        getOnlineDataByAccountId(accountSqlService.getAccountIdForUsername(username),
                                accountSqlService.getCharacterIdForUsername(username, onlineData.getCampaignId())));
            }};
        }
        return onlineStatus;
    }

    public void removeToken(String token) {
        SOCKET_DATA.remove(token);
    }

    public List<OnlineStatus> getOnlineStatus(String username, String campaignId) {
        final String gmTitle;
        GameType gameType = campaignSqlService.getGameTypeForCampaign(campaignId);
        switch (gameType) {
            case VTM:
                gmTitle = "Storyteller";
                break;
            case DND:
                gmTitle = "DM";
                break;
            default:
                gmTitle = "GM";
        }
        List<OnlineStatus> onlineStatus = new ArrayList<>() {{
            OnlineStatus status =
                    getOnlineDataByAccountId(accountSqlService.getAccountIdForUsername(accountSqlService.getGMForCampaignId(campaignId)), gmTitle);
            status.setName(gmTitle);
            add(status);
        }};
        if (accountSqlService.isDungeonMaster(campaignId, username)) {
            List<AccountCharacterDTO> accountCharacters = new ArrayList<>() {{
                addAll(accountSqlService.getCharacterAccounts(campaignId));
            }};
            accountCharacters.forEach(c -> {
                        OnlineStatus status = getOnlineDataByAccountId(c.getAccountId(), c.getCharacterId());
                        status.setName(characterSqlService.getCharacterNameForCharacterId(c.getCharacterId()));
                        onlineStatus.add(status);
                    }
            );
        } else {
            OnlineStatus status = getOnlineDataByAccountId(accountSqlService.getAccountIdForUsername(username),
                    accountSqlService.getCharacterIdForUsername(username, campaignId));
            status.setName(characterSqlService.getCharacterNameForUsername(username, campaignId));
            onlineStatus.add(status);
            return onlineStatus;
        }
        log.info("ONLINE STATUS: {}", onlineStatus);
        return onlineStatus;
    }

    public String getTokenByUsername(String username) {
        String accountId = accountSqlService.getAccountIdForUsername(username);
        for (String key : SOCKET_DATA.keySet()) {
            if (SOCKET_DATA.get(key).getAccountId().equals(accountId)) {
                return key;
            }
        }
        return null;
    }
}
