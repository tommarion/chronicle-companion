package com.webversive.chroniclecompanion.controllers;

import com.webversive.chroniclecompanion.data.sqlite.LocationDTO;
import com.webversive.chroniclecompanion.exception.UnauthorizedException;
import com.webversive.chroniclecompanion.service.LocationService;
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
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/campaign/{campaignId}/locations")
    public ResponseEntity<List<LocationDTO>> getLocationsForCampaign(@AuthenticationPrincipal User user,
                                                                     @PathVariable("campaignId") String campaignId) {
        return new ResponseEntity<>(locationService.getLocations(campaignId, user.getUsername()), OK);
    }

    @GetMapping("/locations/{locationId}")
    public ResponseEntity<LocationDTO> getLocationById(@AuthenticationPrincipal User user,
                                                           @PathVariable("locationId") String locationId) {
        try {
            return new ResponseEntity<>(locationService.getLocationById(locationId, user.getUsername()), OK);
        } catch (UnauthorizedException ue) {
            return new ResponseEntity<>(UNAUTHORIZED);
        }
    }
}
