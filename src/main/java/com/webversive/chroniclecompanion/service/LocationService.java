package com.webversive.chroniclecompanion.service;

import com.webversive.chroniclecompanion.data.sqlite.LocationDTO;
import com.webversive.chroniclecompanion.enums.DataObjectType;
import com.webversive.chroniclecompanion.exception.UnauthorizedException;
import com.webversive.chroniclecompanion.service.sql.AccountSQLService;
import com.webversive.chroniclecompanion.service.sql.LocationSQLService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class LocationService {

    private final LocationSQLService locationSQLService;
    private final AccountSQLService accountSQLService;

    public LocationService(LocationSQLService locationSQLService,
                           AccountSQLService accountSQLService) {
        this.locationSQLService = locationSQLService;
        this.accountSQLService = accountSQLService;
    }
    public List<LocationDTO> getLocations(String campaignId, String username) {
        log.info(locationSQLService.getVtmLocationsByCampaign(campaignId).toString());
        return accountSQLService.isDungeonMaster(campaignId, username) ?
                locationSQLService.getVtmLocationsByCampaign(campaignId) :
                locationSQLService.getVtmLocationsByCampaignAndAccount(campaignId, username);
    }

    public LocationDTO getLocationById(String locationId, String username) throws UnauthorizedException {
        if (accountSQLService.canUserAccess(DataObjectType.LOCATION, username, locationId)) {
            switch (locationSQLService.getGameTypeByLocationId(locationId)) {
                case VTM:
                    return locationSQLService.getVtmLocationById(locationId);
                case DND:
            }
        }
        throw new UnauthorizedException("Not authorized to access this note!");
    }
}
