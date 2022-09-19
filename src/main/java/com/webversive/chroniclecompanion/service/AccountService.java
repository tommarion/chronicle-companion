package com.webversive.chroniclecompanion.service;

import com.webversive.chroniclecompanion.data.app.AccountCharacters;
import com.webversive.chroniclecompanion.data.app.LoginCredentials;
import com.webversive.chroniclecompanion.data.sqlite.AccountCharacterDTO;
import com.webversive.chroniclecompanion.data.sqlite.AccountDTO;
import com.webversive.chroniclecompanion.service.sql.AccountSQLService;
import com.webversive.chroniclecompanion.service.sql.CampaignSQLService;
import com.webversive.chroniclecompanion.util.MapUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Slf4j
public class AccountService {

    private final AccountSQLService accountSqlService;
    private final CampaignSQLService campaignSqlService;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserDetailsManager user;

    public AccountService(AccountSQLService accountSqlService,
                          CampaignSQLService campaignSqlService,
                          BCryptPasswordEncoder bCryptPasswordEncoder,
                          UserDetailsManager user) {
        this.accountSqlService = accountSqlService;
        this.campaignSqlService = campaignSqlService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.user = user;
    }

    public AccountCharacters getCharacterAccountsForCampaign(String username, String campaignId) {
        if (accountSqlService.isDungeonMaster(campaignId, username)) {
            return AccountCharacters.builder()
                    .accounts(accountSqlService.getAccounts().stream()
                            .collect(Collectors.toMap(AccountDTO::getId, AccountDTO::getUsername)))
                    .characters(campaignSqlService.getCharactersByCampaign(campaignId).stream()
                            .map(MapUtil::convertObjectToMap)
                            .collect(Collectors.toList()))
                    .characterAccounts(accountSqlService.getCharacterAccounts(campaignId).stream()
                            .collect(Collectors.toMap(AccountCharacterDTO::getCharacterId,
                                    AccountCharacterDTO::getAccountId)))
                    .build();
        }
        return null;
    }

    public String getAccountIdForUsername(String username) {
        return accountSqlService.getAccountIdForUsername(username);
    }
    public String getCharacterIdForUsername(String username, String chronicleId) {
        return accountSqlService.getCharacterIdForUsername(username, chronicleId);
    }

    @Transactional
    public void createUserAccount(LoginCredentials loginCredentials) {
        String encodedPass = bCryptPasswordEncoder.encode(loginCredentials.getPassword());
        user.createUser(User.builder()
                .username(loginCredentials.getUsername())
                .password(encodedPass)
                .roles("USER")
                .build());
        accountSqlService.addToAccounts(loginCredentials.getUsername(), encodedPass);
    }

    public String getGMForCampaignId(String campaignId) {
        return accountSqlService.getGMForCampaignId(campaignId);
    }
}
