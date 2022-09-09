package com.webversive.chroniclecompanion.service;

import com.webversive.chroniclecompanion.data.app.RollData;
import com.webversive.chroniclecompanion.data.app.RollResults;
import com.webversive.chroniclecompanion.data.app.RollResultsData;
import com.webversive.chroniclecompanion.service.sql.CharacterSQLService;
import lombok.extern.slf4j.Slf4j;
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

    public RollService(CharacterSQLService characterSqlService) {
        this.characterSqlService = characterSqlService;
    }

    public RollResultsData getRollResults(String username, String campaignId, RollData rollData) {
        RollResults rollResults = RollResults.builder()
                .regular(rollD10(rollData.getTotal() - rollData.getHunger()))
                .hunger(rollD10(rollData.getHunger()))
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
                .timestamp(new Date())
                .roll(rollResults)
                .reroll(nonNull(rollData.getReroll()))
                .build();
    }

    private List<Integer> flipD2(int count) {
        return rollDice(count, 2);
    }
    private List<Integer> rollD4(int count) {
        return rollDice(count, 4);
    }
    private List<Integer> rollD6(int count) {
        return rollDice(count, 6);
    }
    private List<Integer> rollD10(int count) {
        return rollDice(count, 10);
    }
    private List<Integer> rollD20(int count) {
        return rollDice(count, 20);
    }

    private List<Integer> rollDice(int count, int max) {
        return new Random()
                .ints(count, 1, max+1)
                .boxed()
                .collect(Collectors.toList());
    }
}
