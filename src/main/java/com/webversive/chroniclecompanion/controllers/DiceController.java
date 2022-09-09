package com.webversive.chroniclecompanion.controllers;

import com.webversive.chroniclecompanion.data.app.RollData;
import com.webversive.chroniclecompanion.data.app.RollResultsData;
import com.webversive.chroniclecompanion.service.RollService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.OK;

@RestController
@Slf4j
public class DiceController {

    private final RollService rollService;

    public DiceController(RollService rollService) {
        this.rollService = rollService;
    }

    @PostMapping("/campaign/{campaignId}/roll/")
    public ResponseEntity<RollResultsData> rollDice(@AuthenticationPrincipal User user,
                                                    @PathVariable("campaignId") String campaignId,
                                                    @RequestBody RollData rollData){
        return new ResponseEntity<>(rollService.getRollResults(user.getUsername(), campaignId, rollData), OK);
    }
}
