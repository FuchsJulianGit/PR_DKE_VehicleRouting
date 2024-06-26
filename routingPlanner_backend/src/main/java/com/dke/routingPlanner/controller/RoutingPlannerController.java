package com.dke.routingPlanner.controller;

import com.dke.routingPlanner.entities.RoutePoint;
//import com.dke.routingPlanner.entities.RoutePointNew;
import com.dke.routingPlanner.services.RoutePointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class RoutingPlannerController {

    @Autowired
    private RoutePointService routeService;

    //Angular Frankenstein - DELETE in case of error

    /*@GetMapping("/RoutePointsNew")
    public ResponseEntity<?> findAllRoutePointsNew() {
        try {
            List<RoutePoint> routePoints = routeService.getRoutePoint();
            List<RoutePointNew> modifiedRoutePoints = routePoints.stream()
                    .map(this::convertToRoutePointNew)
                    .collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.OK).body(modifiedRoutePoints);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch RoutePoints: " + e.getMessage());
        }
    }*/

  /*  @GetMapping("/RoutePointsNew/vehicle/{vehicle}")
    public ResponseEntity<?> findRoutePointByVehicleId(@PathVariable int vehicle) {
        try {
            List<RoutePoint> routePoints = routeService.getRoutePointByVehicleId(vehicle);
            List<RoutePointNew> modifiedRoutePoints = routePoints.stream()
                    .map(this::convertToRoutePointNew)
                    .collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.OK).body(modifiedRoutePoints);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch RoutePoints: " + e.getMessage());
        }
    }*/



  /*  private RoutePointNew convertToRoutePointNew(RoutePoint routePoint) {
        RoutePointNew modifiedRoutePoint = new RoutePointNew();
        modifiedRoutePoint.setId(routePoint.getId());
        modifiedRoutePoint.setRouteName(routePoint.getRouteId());
        modifiedRoutePoint.setSequence(routePoint.getSequenz());
        modifiedRoutePoint.setAtHome(routePoint.isAtHome());
        modifiedRoutePoint.setCoordinates(routePoint.getCoordinateId());
        modifiedRoutePoint.setVehicle(routePoint.getVehicle());
        return modifiedRoutePoint;
    }*/



    //


    @PostMapping("/addRoutePoint")
    public ResponseEntity<?> addRoutePoint(@RequestBody RoutePoint routePoint) {
        try {
            RoutePoint savedRoutePoint = routeService.saveRoutePoint(routePoint);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRoutePoint);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add RoutePoint: " + e.getMessage());
        }
    }

    @GetMapping("/RoutePoints")
    public ResponseEntity<?> findAllRoutePoints() {
        try {
            List<RoutePoint> routePoints = routeService.getRoutePoint();
            return ResponseEntity.status(HttpStatus.OK).body(routePoints);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch RoutePoints: " + e.getMessage());
        }
    }

    @GetMapping("/RoutePoints/{id}")
    public ResponseEntity<?> findRoutePointById(@PathVariable int id) {
        try {
            RoutePoint routePoint = routeService.getRoutePoint(id);
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
            RoutePoint updatedRoutePoint = routeService.updateRoutePoint(routePoint);
            if (updatedRoutePoint != null) {
                return ResponseEntity.status(HttpStatus.OK).body(updatedRoutePoint);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("RoutePoint not found with id: " + routePoint.getId());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update RoutePoint: " + e.getMessage());
        }
    }

    @DeleteMapping("/RoutePoints/delete/{id}")
    public ResponseEntity<?> deleteRoutePoint(@PathVariable int id) {
        try {
            String result = routeService.deleteRoutePoint(id);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete RoutePoint: " + e.getMessage());
        }
    }

    @DeleteMapping("/RoutePoints/delete/{route_name}")
    public ResponseEntity<?> deleteRoutePointsByDescription(@PathVariable String route_name) {
        try {
            String deletedCount = routeService.deleteRoutePointsByDescription(route_name);
            return ResponseEntity.status(HttpStatus.OK).body(deletedCount + " RoutePoints deleted for description: " + route_name);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete RoutePoints: " + e.getMessage());
        }
    }





    @GetMapping("/")
    public ResponseEntity<?> index() {
        try {
            StringBuilder response = new StringBuilder();
            Iterable<RoutePoint> routePoints = routeService.getAllRoutePoints();
            for (RoutePoint routePoint : routePoints) {
                response.append("RoutePoint ID: ").append(routePoint.getId()).append("<br>");
                response.append("Route_Name: ").append(routePoint.getRouteId()).append("<br>");
                response.append("Sequenz: ").append(routePoint.getSequenz()).append("<br>");
                response.append("AtHome: ").append(routePoint.isAtHome()).append("<br>");
                response.append("Coordinates: ").append(routePoint.getCoordinates()).append("<br>");
                response.append("Vehicle: ").append(routePoint.getVehicleId()).append("<br><br>");
                response.append("CoordinateId: ").append(routePoint.getCoordinateId()).append("<br><br>");
            }
            return ResponseEntity.status(HttpStatus.OK).body(response.toString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch RoutePoints: " + e.getMessage());
        }
    }
}
