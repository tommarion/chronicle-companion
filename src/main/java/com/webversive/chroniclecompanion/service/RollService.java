package com.webversive.chroniclecompanion.service;

import com.webversive.chroniclecompanion.data.app.DndRollData;
import com.webversive.chroniclecompanion.data.app.DndRollResults;
import com.webversive.chroniclecompanion.data.app.DndRollResultsData;
import com.webversive.chroniclecompanion.data.app.RollData;
import com.webversive.chroniclecompanion.data.app.RollResults;
import com.webversive.chroniclecompanion.data.app.RollResultsData;
import com.webversive.chroniclecompanion.enums.NotifyType;
import com.webversive.chroniclecompanion.service.sql.CharacterSQLService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;

@Service
@Slf4j
public class RollService {

    private final CharacterSQLService characterSqlService;
    private final SimpMessagingTemplate brokerMessagingTemplate;

    public RollService(CharacterSQLService characterSqlService, SimpMessagingTemplate brokerMessagingTemplate) {
        this.characterSqlService = characterSqlService;
        this.brokerMessagingTemplate = brokerMessagingTemplate;
    }

    public RollResultsData getRollResults(String username, String campaignId, RollData rollData) {
        RollResults rollResults = RollResults.builder()
                .regular(rollDice(rollData.getTotal() - rollData.getHunger(), 10))
                .hunger(rollDice(rollData.getHunger(), 10))
                .build();
        if (nonNull(rollData.getReroll())) {
            rollResults.getRegular().addAll(rollData.getReroll().getRegular());
            rollResults.getHunger().addAll(rollData.getReroll().getHunger());
        }
        return RollResultsData.builder()
                .player(characterSqlService.getCharacterNameForUsername(username, campaignId))
                .alias(rollData.getAlias())
                .notify(rollData.getNotify())
                .rollFor(rollData.getRollFor())
                .rollWith(rollData.getRollWith())
                .timestamp(new Date())
                .roll(rollResults)
                .reroll(nonNull(rollData.getReroll()))
                .build();
    }
    public DndRollResultsData getRollResults(String username, String campaignId, DndRollData rollData) {
        return DndRollResultsData.builder()
                .player(characterSqlService.getCharacterNameForUsername(username, campaignId))
                .alias(rollData.getAlias())
                .notify(rollData.getNotify())
                .timestamp(new Date())
                .roll(rollData.getDiceMap().stream()
                        .map((details) -> DndRollResults.builder()
                                .diceType(details.getType())
                                .results(rollDice(details.getValue(), details.getType()))
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
    public DndRollResultsData getGoDiceRollResults(String username, String campaignId, DndRollResultsData rollResultsData) {
        rollResultsData.setPlayer(characterSqlService.getCharacterNameForUsername(username, campaignId));
        rollResultsData.setTimestamp(new Date());
        return rollResultsData;
    }

    private List<Integer> rollDice(int count, int max) {
        return new Random()
                .ints(count, 1, max+1)
                .boxed()
                .collect(Collectors.toList());
    }

    public void handleDndRollResults(DndRollResultsData resultsData, String username, String campaignId,
                                      String gmSessionId, String userSessionId) {
        if (resultsData.getNotify().equals(NotifyType.EVERYONE)) {
            brokerMessagingTemplate.convertAndSend("/secured/campaign/" + campaignId + "/roll/results",
                    resultsData);
        } else {
            brokerMessagingTemplate.convertAndSend(
                    "/secured/user/" + userSessionId + "/campaign/" + campaignId + "/roll/results",
                    getGoDiceRollResults(username, campaignId, resultsData));
            if (!userSessionId.equals(gmSessionId)) {
                brokerMessagingTemplate.convertAndSend(
                        "/secured/user/" + gmSessionId + "/campaign/" + campaignId + "/roll/results",
                        getGoDiceRollResults(username, campaignId, resultsData));
            }
        }
    }
}
