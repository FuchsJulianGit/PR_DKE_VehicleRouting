package com.dke.routingPlanner.controller;

import com.dke.routingPlanner.entities.RoutePoint;
import com.dke.routingPlanner.services.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
public class RoutingPlannerController {

    @Autowired
    private RouteService routeService;

    @PostMapping("/addRoutePoint")
    public RoutePoint addRoutePoint(@RequestBody RoutePoint routePoint) {
        return routeService.saveRoutePoint(routePoint);
    }

    @GetMapping("/RoutePoints")
    public List<RoutePoint> findAllRoutePoints() {
        return routeService.getRoutePoint();
    }

    @GetMapping("/RoutePoints/{id}")
    public RoutePoint findRoutePointById(@PathVariable int id) {
        return routeService.getRoutePoint(id);
    }


    @PutMapping("/update")
    public RoutePoint updateRoutePoint(@RequestBody RoutePoint routePoint) {
        return routeService.updateRoutePoint(routePoint);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteRoutePoint(@PathVariable int id) {
        return routeService.deleteRoutePoint(id);
    }

    @GetMapping("/")
    public String index() {
        StringBuilder response = new StringBuilder();
        response.append("Greetings from Spring Boot!<br>");

        // Fetch some RoutePoints from the service
        Iterable<RoutePoint> routePoints = routeService.getAllRoutePoints();

        // Append information about each RoutePoint to the response
        for (RoutePoint routePoint : routePoints) {
            response.append("RoutePoint ID: ").append(routePoint.getId()).append("<br>");
            response.append("Sequence: ").append(routePoint.getSeq()).append("<br>");
            response.append("Start Point: ").append(routePoint.getStartPoint()).append("<br>");
            response.append("Person: ").append(routePoint.getPerson()).append("<br><br>");
        }

        return response.toString();
    }
}
