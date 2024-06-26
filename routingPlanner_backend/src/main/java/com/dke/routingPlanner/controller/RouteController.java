package com.dke.routingPlanner.controller;

import com.dke.routingPlanner.entities.Route;
import com.dke.routingPlanner.services.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class RouteController {

    @Autowired
    private RouteService routeService;
    @GetMapping("/Route")
    public ResponseEntity<?> getAllRoutes() {
        try {
            List<Route> routes = routeService.getAllRoutes();
            return ResponseEntity.status(HttpStatus.OK).body(routes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch routes: " + e.getMessage());
        }
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch route: " + e.getMessage());
        }
    }

    @PostMapping("/Route")
    public ResponseEntity<?> createRoute(@RequestBody Route route) {
        try {
            Route createdRoute = routeService.saveRoute(route);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRoute);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create route: " + e.getMessage());
        }
    }

    @DeleteMapping("/Route_Plan/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable int id) {
        try {
            routeService.deleteRoute(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body((Void) null);
        }
    }

    @GetMapping("/Route_Plan")
    public ResponseEntity<?> getRoutesWithPoints() {
        try {
            List<Map<String, Object>> routes = routeService.getRoutesWithPoints();
            return ResponseEntity.status(HttpStatus.OK).body(routes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch routes with points: " + e.getMessage());
        }
    }

    @GetMapping("/Route_Plan/vehicle/{vehicleId}")
    public ResponseEntity<?> getRoutesWithPointsByVehicleId(@PathVariable int vehicleId) {
        try {
            List<Map<String, Object>> routes = routeService.getRoutesWithPointsByVehicleId(vehicleId);
            return ResponseEntity.status(HttpStatus.OK).body(routes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch routes with points for vehicle " + vehicleId + ": " + e.getMessage());
        }
    }

    // Example of endpoints not implemented but defined for demonstration
    @GetMapping("/Wegstrecken")
    public ResponseEntity<?> getWegstrecke() {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("Endpoint not implemented");
    }

    @GetMapping("/Fahrtenblätter")
    public ResponseEntity<?> getDriveplan() {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("Endpoint not implemented");
    }
}
