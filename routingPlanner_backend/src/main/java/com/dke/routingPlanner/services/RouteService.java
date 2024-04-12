package com.dke.routingPlanner.services;

import com.dke.routingPlanner.entities.RoutePoint;
import com.dke.routingPlanner.repositories.RoutePointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    @Autowired
    private RoutePointRepository repository;

    public RoutePoint saveRoutePoint(RoutePoint routePoint) {
        return repository.save(routePoint);
    }

    public List<RoutePoint> saveRoutePoint(List<RoutePoint> routePoint) {
        return (List<RoutePoint>) repository.saveAll(routePoint);
    }

    public List<RoutePoint> getRoutePoint() {
        return (List<RoutePoint>) repository.findAll();
    }

    public RoutePoint getRoutePoint(int id) {
        return repository.findById(id).orElse(null);
    }

    public String deleteRoutePoint(int id) {
        repository.deleteById(id);
        return "Point removed " + id;
    }

    public RoutePoint updateRoutePoint(RoutePoint routePoint) {
        RoutePoint existingRoutePoint= repository.findById(routePoint.getId()).orElse(null);
        existingRoutePoint.setSeq(routePoint.getSeq());
        existingRoutePoint.setStartPoint(routePoint.getStartPoint());
        existingRoutePoint.setPerson(routePoint.getPerson());
        return repository.save(existingRoutePoint);
    }

    public Iterable<RoutePoint> getAllRoutePoints() {
        return repository.findAll();
    }
}