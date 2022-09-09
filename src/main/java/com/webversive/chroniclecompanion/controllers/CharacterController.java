package com.webversive.chroniclecompanion.controllers;

import com.webversive.chroniclecompanion.data.app.CharacterBeing;
import com.webversive.chroniclecompanion.data.app.character.Character;
import com.webversive.chroniclecompanion.exception.UnauthorizedException;
import com.webversive.chroniclecompanion.service.CharacterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@Slf4j
public class CharacterController {

    private final CharacterService characterService;

    public CharacterController(CharacterService characterService) {
        this.characterService = characterService;
    }

    @GetMapping("/campaign/{campaignId}/characters/")
    public ResponseEntity<List<CharacterBeing>> getCharactersByCampaign(@AuthenticationPrincipal User user,
                                                                        @PathVariable("campaignId") String campaignId) {
        try {
            return new ResponseEntity<>(characterService.getCharactersForCampaign(user.getUsername(), campaignId), OK);
        } catch (UnauthorizedException uex) {
            log.error(uex.getMessage(), uex);
        }
        return new ResponseEntity<>(UNAUTHORIZED);
    }

    @GetMapping("/character/{characterId}/")
    public ResponseEntity<Character> getCharacterById(@AuthenticationPrincipal User user,
                                                      @PathVariable("characterId") String characterId) {
        try {
            return new ResponseEntity<>(characterService.getCharacterById(user.getUsername(), characterId), OK);
        } catch (UnauthorizedException uex) {
            log.error(uex.getMessage(), uex);
        }
        return new ResponseEntity<>(UNAUTHORIZED);
    }
}
