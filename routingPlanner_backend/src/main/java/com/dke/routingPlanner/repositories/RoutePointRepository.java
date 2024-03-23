package com.dke.routingPlanner.repositories;

import com.dke.routingPlanner.entities.RoutePoint;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoutePointRepository extends CrudRepository<RoutePoint, Integer> {
}
