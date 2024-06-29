package com.dke.routingPlanner.controller;

import com.dke.routingPlanner.entities.RoutePoint;
//import com.dke.routingPlanner.entities.RoutePointNew;
import com.dke.routingPlanner.services.RoutePointService;
import com.dke.routingPlanner.services.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class RoutingPlannerController {

    @Autowired
    private RoutePointService routePointService;

    @Autowired
    private RouteService routeService;

    @PostMapping("/addRoutePoint")
    public ResponseEntity<?> addRoutePoint(@RequestBody RoutePoint routePoint) {
        try {
            RoutePoint savedRoutePoint = routePointService.saveRoutePoint(routePoint);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRoutePoint);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add RoutePoint: " + e.getMessage());
        }
    }

    @GetMapping("/RoutePoints")
    public ResponseEntity<?> findAllRoutePoints() {
        try {
            List<RoutePoint> routePoints = routePointService.getRoutePoint();
            return ResponseEntity.status(HttpStatus.OK).body(routePoints);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch RoutePoints: " + e.getMessage());
        }
    }

    @GetMapping("/RoutePoints/{id}")
    public ResponseEntity<?> findRoutePointById(@PathVariable int id) {
        try {
            RoutePoint routePoint = routePointService.getRoutePoint(id);
            if (routePoint != null) {
                return ResponseEntity.status(HttpStatus.OK).body(routePoint);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("RoutePoint not found with id: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch RoutePoint: " + e.getMessage());
        }
    }

    @PutMapping("/RoutePoints/update")
    public ResponseEntity<?> updateRoutePoint(@RequestBody RoutePoint routePoint) {
        try {
            RoutePoint updatedRoutePoint = routePointService.updateRoutePoint(routePoint);
            if (updatedRoutePoint != null) {
                return ResponseEntity.status(HttpStatus.OK).body(updatedRoutePoint);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("RoutePoint not found with id: " + routePoint.getId());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update RoutePoint: " + e.getMessage());
        }
    }


    @GetMapping("/")
    public ResponseEntity<?> index() {
        try {
            StringBuilder response = new StringBuilder();
            Iterable<RoutePoint> routePoints = routePointService.getAllRoutePoints();
            for (RoutePoint routePoint : routePoints) {
                response.append("RoutePoint ID: ").append(routePoint.getId()).append("<br>");
                response.append("Route_Name: ").append(routePoint.getRouteId()).append("<br>");
                response.append("Sequenz: ").append(routePoint.getSequenz()).append("<br>");
                response.append("AtHome: ").append(routePoint.isAtHome()).append("<br>");
                response.append("Coordinates: ").append(routePoint.getCoordinates()).append("<br>");
                response.append("Vehicle: ").append( routeService.getVehicleIdByRoutePoint(routePoint.getRouteId())).append("<br><br>");
                response.append("CoordinateId: ").append(routePoint.getCoordinateId()).append("<br><br>");
            }
            return ResponseEntity.status(HttpStatus.OK).body(response.toString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch RoutePoints: " + e.getMessage());
        }
    }
}
