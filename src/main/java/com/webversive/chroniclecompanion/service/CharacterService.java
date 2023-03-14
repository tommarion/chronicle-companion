package com.webversive.chroniclecompanion.service;

import com.webversive.chroniclecompanion.data.app.CharacterBeing;
import com.webversive.chroniclecompanion.data.app.character.Character;
import com.webversive.chroniclecompanion.data.app.character.InventoryCategories;
import com.webversive.chroniclecompanion.data.app.character.InventoryItem;
import com.webversive.chroniclecompanion.data.app.character.VtmCharacterSheet;
import com.webversive.chroniclecompanion.enums.BeingType;
import com.webversive.chroniclecompanion.enums.GameType;
import com.webversive.chroniclecompanion.exception.UnauthorizedException;
import com.webversive.chroniclecompanion.service.sql.AccountSQLService;
import com.webversive.chroniclecompanion.service.sql.CampaignSQLService;
import com.webversive.chroniclecompanion.service.sql.CharacterSQLService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.webversive.chroniclecompanion.enums.DataObjectType.CHARACTER;
import static java.util.Objects.nonNull;

@Service
@Slf4j
public class CharacterService {
    private final CharacterSQLService characterSqlService;
    private final CampaignSQLService campaignSqlService;
    private final AccountSQLService accountSqlService;

    public CharacterService(CampaignSQLService campaignSqlService,
                            AccountSQLService accountSqlService,
                            CharacterSQLService characterSQLService) {
        this.campaignSqlService = campaignSqlService;
        this.accountSqlService = accountSqlService;
        this.characterSqlService = characterSQLService;
    }

    public List<CharacterBeing> getCharactersForCampaign(String username, String campaignId)
            throws UnauthorizedException {
        if (accountSqlService.isDungeonMaster(campaignId, username)) {
            return campaignSqlService.getCharacterBeingsByCampaign(campaignId);
        }
        throw new UnauthorizedException("Not authorized to perform this operation");
    }

    private Character getCharacterById(String characterId) {
        String campaignId = accountSqlService.getCampaignIdByCharacter(characterId);
        GameType gameType = campaignSqlService.getGameTypeForCampaign(campaignId);
        try {
            switch (gameType) {
                case VTM:
                    Character character = characterSqlService.getVtmCharacterById(characterId);
                    if (nonNull(character)) {
                        VtmCharacterSheet sheet = character.getSheet();
                        sheet.setAttributes(characterSqlService.getAttributesByCharacterId(characterId));
                        sheet.setSkills(characterSqlService.getSkillsByCharacterId(characterId));
                        sheet.setAdvantages(characterSqlService.getAdvantagesByCharacterId(characterId));
                        sheet.setFlaws(characterSqlService.getFlawsByCharacterId(characterId));
                        sheet.setConvictions(characterSqlService.getConvictionsByCharacterId(characterId));
                        sheet.setTouchstones(characterSqlService.getTouchstonesByCharacterId(characterId));
                        sheet.setRetainers(characterSqlService.getRetainersByCharacterId(characterId));
                        sheet.setBloodSlaves(characterSqlService.getBloodSlavesByCharacterId(characterId, BeingType.MORTAL.value));
                        sheet.setAnimals(characterSqlService.getBloodSlavesByCharacterId(characterId, BeingType.ANIMAL.value));
                        sheet.setGhouls(characterSqlService.getBloodSlavesByCharacterId(characterId, BeingType.GHOUL.value));
                    }
                    character.setDisciplines(characterSqlService.getVtmDisciplinesByCharacterId(characterId));
                    InventoryCategories inventory = InventoryCategories.builder()
                            .armor(new ArrayList<>())
                            .weapons(new ArrayList<>())
                            .misc(new ArrayList<>())
                            .build();
                    for (InventoryItem inventoryItem : characterSqlService.getInventoryByCharacterId(characterId)) {
                        if (inventoryItem.isArmor()) {
                            inventory.getArmor().add(inventoryItem);
                        } else if (inventoryItem.isWeapon()) {
                            inventory.getWeapons().add(inventoryItem);
                        } else {
                            inventory.getMisc().add(inventoryItem);
                        }
                    }
                    character.setInventory(inventory);
                    return character;
                case DND:
                default:
                    return null;
            }

        } catch (EmptyResultDataAccessException erdae) {
            log.error("Unable to find character data for id: {}", characterId);
            return null;
        }
    }

    public Character getCharacterById(String username, String characterId) throws UnauthorizedException {
        if (accountSqlService.canUserAccess(CHARACTER, username, characterId)) {
            return getCharacterById(characterId);
        }
        throw new UnauthorizedException("Not authorized to access this content");
    }
}
