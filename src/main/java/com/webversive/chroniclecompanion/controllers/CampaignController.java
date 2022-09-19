package com.webversive.chroniclecompanion.controllers;

import com.webversive.chroniclecompanion.data.app.CampaignBook;
import com.webversive.chroniclecompanion.data.app.CampaignData;
import com.webversive.chroniclecompanion.service.CampaignService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
public class CampaignController {

    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping("/campaigns")
    public ResponseEntity<List<CampaignBook>> getCampaigns(@AuthenticationPrincipal User user) {
        return new ResponseEntity<>(campaignService.getCampaignsForAccount(user.getUsername()), HttpStatus.OK);
    }

    @GetMapping("/vampire/chronicle/{chronicleId}")
    public ResponseEntity<CampaignData> getChronicleData(@AuthenticationPrincipal User user,
                                                         @PathVariable(value="chronicleId") String chronicleId) {
        return new ResponseEntity<>(campaignService.getCampaignDataById(user.getUsername(), chronicleId),
                HttpStatus.OK);
    }
}
