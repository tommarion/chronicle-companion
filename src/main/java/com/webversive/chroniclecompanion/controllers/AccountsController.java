package com.webversive.chroniclecompanion.controllers;

import com.webversive.chroniclecompanion.data.app.AccountCharacters;
import com.webversive.chroniclecompanion.data.app.LoginCredentials;
import com.webversive.chroniclecompanion.data.app.OnlineStatus;
import com.webversive.chroniclecompanion.service.AccountService;
import com.webversive.chroniclecompanion.service.OnlineService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static java.util.Objects.isNull;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.OK;

@RestController
@Slf4j
public class AccountsController {
    private final AccountService accountService;
    private final OnlineService onlineService;

    public AccountsController(AccountService accountService,
                              OnlineService onlineService) {
        this.accountService = accountService;
        this.onlineService = onlineService;
    }

    @GetMapping("/campaign/{campaignId}/character/accounts")
    public ResponseEntity<AccountCharacters> getCharacterAccountsForCampaign(@AuthenticationPrincipal User user,
                                                                             @PathVariable("campaignId") String campaignId) {
        final AccountCharacters accountCharacters = accountService.getCharacterAccountsForCampaign(user.getUsername(),
                campaignId);
        if (isNull(accountCharacters)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(accountCharacters, OK);
    }

//    @PostMapping("/campaign/{campaignId}/online/token/")
//    public ResponseEntity<String> registerToken(@AuthenticationPrincipal User user,
//                                                @PathVariable("campaignId") String campaignId,
//                                                @RequestBody String token) {
//        onlineService.addTokenToSocketData(token, OnlineData.builder()
//                .accountId(accountService.getAccountIdForUsername(user.getUsername()))
//                .campaignId(campaignId)
//                .characterId(accountService.getCharacterIdForUsername(user.getUsername(), campaignId))
//                .build());
//        return new ResponseEntity<>(OK);
//    }

    @GetMapping("/campaign/{campaignId}/online")
    public ResponseEntity<List<OnlineStatus>> getOnlineStatus(@AuthenticationPrincipal User user,
                                                              @PathVariable("campaignId") String campaignId) {
        try {
            return new ResponseEntity<>(onlineService.getOnlineStatus(user.getUsername(), campaignId),
                    OK);
        } catch (NullPointerException npe) {
            log.error("Unable to find ");
            return new ResponseEntity<>(INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerAccount(@RequestBody LoginCredentials loginCredentials) {
        try {
            accountService.createUserAccount(loginCredentials);
        } catch (Exception ex) {
            return new ResponseEntity<>("Error creating account: " + ex.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Account created!", HttpStatus.CREATED);
    }
}
