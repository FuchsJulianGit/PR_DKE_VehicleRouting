package com.dke.routingPlanner.services;

import com.dke.routingPlanner.entities.Route;
import com.dke.routingPlanner.repositories.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    @Autowired
    private RouteRepository repository;

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
}
