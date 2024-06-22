package com.dke.routingPlanner.repositories;

import com.dke.routingPlanner.entities.Route;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteRepository extends CrudRepository<Route, Integer> {
}
