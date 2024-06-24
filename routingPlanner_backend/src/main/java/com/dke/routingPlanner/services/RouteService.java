package com.dke.routingPlanner.services;

import com.dke.routingPlanner.entities.Route;
import com.dke.routingPlanner.entities.RoutePoint;
import com.dke.routingPlanner.repositories.RoutePointRepository;
import com.dke.routingPlanner.repositories.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class RouteService {

    @Autowired
    private RouteRepository repository;

    @Autowired
    private RoutePointRepository routePointRepository;


    public Route saveRoute(Route Route) {
        return repository.save(Route);
    }

    public List<Route> saveRoute(List<Route> Route) {
        return (List<Route>) repository.saveAll(Route);
    }

    public List<Route> getRoute() {
        return (List<Route>) repository.findAll();
    }


    public Route getRouteById(int id) {
        return repository.findById(id).orElse(null);
    }

    public String deleteRoute(int id) {
        repository.deleteById(id);
        return "Route removed " + id;
    }

    public List<Route> getAllRoutes() {
        return (List<Route>) repository.findAll();
    }

    // DTO

    public List<Map<String, Object>> getRoutesWithPoints() {
        Iterable<Route> routes = repository.findAll();
        return StreamSupport.stream(routes.spliterator(), false)
                .map(this::convertToRouteMap)
                .collect(Collectors.toList());
    }
    public List<Map<String, Object>> getRoutesWithPointsByVehicleId(int vehicleId) {
        Iterable<Route> routes = repository.findByVehicleId(vehicleId);
        return StreamSupport.stream(routes.spliterator(), false)
                .map(this::convertToRouteMap)
                .collect(Collectors.toList());
    }


    private Map<String, Object> convertToRouteMap(Route route) {
        Map<String, Object> routeMap = new HashMap<>();
        List<Map<String, Object>> routePointMaps = routePointRepository.findByRouteId(route.getId()).stream()
                .map(this::convertToRoutePointMap)
                .collect(Collectors.toList());
        routeMap.put("routePoints", routePointMaps);
        return routeMap;
    }

    private Map<String, Object> convertToRoutePointMap(RoutePoint routePoint) {
        Map<String, Object> routePointMap = new HashMap<>();
        Route route = repository.findById(routePoint.getRouteId()).orElseThrow();
        routePointMap.put("id", routePoint.getId());
        routePointMap.put("routeName", route.getRouteName());
        routePointMap.put("sequence", routePoint.getSequence());
        routePointMap.put("atHome", routePoint.isAtHome());
        routePointMap.put("coordinates", routePoint.getCoordinateId());
        routePointMap.put("vehicle", routePoint.getVehicle());
        return routePointMap;
    }
}
