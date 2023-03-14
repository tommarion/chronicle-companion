package com.webversive.chroniclecompanion.controllers;

import com.webversive.chroniclecompanion.data.app.DndRollData;
import com.webversive.chroniclecompanion.data.app.DndRollResultsData;
import com.webversive.chroniclecompanion.data.app.RollData;
import com.webversive.chroniclecompanion.enums.NotifyType;
import com.webversive.chroniclecompanion.service.AccountService;
import com.webversive.chroniclecompanion.service.OnlineService;
import com.webversive.chroniclecompanion.service.RollService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.OK;

@RestController
@Slf4j
public class DiceController {
    private final RollService rollService;
    private final AccountService accountService;
    private final OnlineService onlineService;
    private final SimpMessagingTemplate brokerMessagingTemplate;

    public DiceController(RollService rollService,
                          AccountService accountService,
                          OnlineService onlineService,
                          SimpMessagingTemplate brokerMessagingTemplate) {
        this.rollService = rollService;
        this.accountService = accountService;
        this.onlineService = onlineService;
        this.brokerMessagingTemplate = brokerMessagingTemplate;
    }

    @PostMapping("/vampire/campaign/{campaignId}/roll")
    public ResponseEntity<String> rollDice(@AuthenticationPrincipal User user,
                                           @PathVariable("campaignId") String campaignId,
                                           @RequestBody RollData rollData){
        try {
            if (rollData.getNotify().equals(NotifyType.EVERYONE)) {
                brokerMessagingTemplate.convertAndSend("/secured/roll/results",
                        rollService.getRollResults(user.getUsername(), campaignId, rollData));
            } else {
                String gmUsername = accountService.getGMForCampaignId(campaignId);
                String gmSessionId = onlineService.getTokenByUsername(gmUsername);
                String userSessionId = onlineService.getTokenByUsername(user.getUsername());
                brokerMessagingTemplate.convertAndSend(
                        "/secured/user/" + userSessionId + "/roll/results",
                        rollService.getRollResults(user.getUsername(), campaignId, rollData));
                if (!userSessionId.equals(gmSessionId)) {
                    brokerMessagingTemplate.convertAndSend(
                            "/secured/user/" + gmSessionId + "/roll/results",
                            rollService.getRollResults(user.getUsername(), campaignId, rollData));
                }
            }

            return new ResponseEntity<>("Accepted", OK);
        } catch (Exception ex) {
            log.error("Error submitting roll results", ex);
            return new ResponseEntity<>("Error submitting roll results", BAD_REQUEST);
        }
    }


    @PostMapping("/dnd/campaign/{campaignId}/godice/roll")
    public ResponseEntity<String> rollGoDice(@AuthenticationPrincipal User user,
                                           @PathVariable("campaignId") String campaignId,
                                           @RequestBody DndRollResultsData rollResultsData) {
        try {
            String gmUsername = accountService.getGMForCampaignId(campaignId);
            rollService.handleDndRollResults(rollService.getGoDiceRollResults(user.getUsername(), campaignId, rollResultsData),
                    user.getUsername(), campaignId, onlineService.getTokenByUsername(gmUsername),
                    onlineService.getTokenByUsername(user.getUsername()));
            return new ResponseEntity<>("Accepted", OK);
        } catch (Exception ex) {
            log.error("Error submitting roll results", ex);
            return new ResponseEntity<>("Error submitting roll results", BAD_REQUEST);
        }
    }

    @PostMapping("/dnd/campaign/{campaignId}/roll")
    public ResponseEntity<String> rollDice(@AuthenticationPrincipal User user,
                                           @PathVariable("campaignId") String campaignId,
                                           @RequestBody DndRollData rollData){
        try {
            String gmUsername = accountService.getGMForCampaignId(campaignId);
            rollService.handleDndRollResults(rollService.getRollResults(user.getUsername(), campaignId, rollData),
                    user.getUsername(), campaignId, onlineService.getTokenByUsername(gmUsername),
                    onlineService.getTokenByUsername(user.getUsername()));
            return new ResponseEntity<>("Accepted", OK);
        } catch (Exception ex) {
            log.error("Error submitting roll results", ex);
            return new ResponseEntity<>("Error submitting roll results", BAD_REQUEST);
        }
    }
}
