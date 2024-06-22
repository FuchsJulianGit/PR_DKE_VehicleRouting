package com.dke.routingPlanner.controller;

import com.dke.routingPlanner.entities.Route;
import com.dke.routingPlanner.entities.RoutePoint;
import com.dke.routingPlanner.services.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class RouteController {

    @Autowired
    private RouteService routeService;
    @GetMapping("/Route")
    public List<Route> getAllRoutes() {
        return routeService.getAllRoutes();
    }

    @GetMapping("/Route/{id}")
    public ResponseEntity<?> getRouteById(@PathVariable int id) {

        try {
            Route route = routeService.getRouteById(id);
            if (route != null) {
                return ResponseEntity.status(HttpStatus.OK).body(route);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Route not found with id: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch Route: " + e.getMessage());
        }
    }

    @PostMapping("/Route")
    public Route createRoute(@RequestBody Route route) {
        return routeService.saveRoute(route);
    }

    @DeleteMapping("/Route/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable int id) {
        routeService.deleteRoute(id);
        return ResponseEntity.noContent().build();
    }
}
