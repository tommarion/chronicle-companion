package com.webversive.chroniclecompanion.controllers;

import com.webversive.chroniclecompanion.data.app.OnlineData;
import com.webversive.chroniclecompanion.data.app.socket.SocketMessage;
import com.webversive.chroniclecompanion.data.app.socket.SocketOutputMessage;
import com.webversive.chroniclecompanion.service.AccountService;
import com.webversive.chroniclecompanion.service.OnlineService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import static java.util.Objects.nonNull;

@Controller
@Slf4j
public class SocketController {

    final OnlineService onlineService;
    final AccountService accountService;

    public SocketController(OnlineService onlineService,
                            AccountService accountService) {
        this.onlineService = onlineService;
        this.accountService = accountService;
    }

    @MessageMapping("/register")
    @SendTo("/secured/online/update")
    public SocketOutputMessage send(@Payload SocketMessage socketMessage, SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        if (nonNull(headerAccessor.getUser())) {
            log.info(headerAccessor.getUser().getName());
        }
        if (nonNull(headerAccessor.getUser())) {
            String username = headerAccessor.getUser().getName();
            String sessionId = headerAccessor.getSessionId();
            String chronicleId = socketMessage.getCampaignId();
            onlineService.addTokenToSocketData(sessionId, OnlineData.builder()
                    .accountId(accountService.getAccountIdForUsername(username))
                    .characterId(accountService.getCharacterIdForUsername(username, chronicleId))
                    .campaignId(chronicleId)
                    .build());
            log.info(onlineService.getOnlineDataByToken(sessionId).toString());
        }
        log.info("Register received");
        return new SocketOutputMessage(new SimpleDateFormat("HH:mm").format(new Date()));
    }
}
