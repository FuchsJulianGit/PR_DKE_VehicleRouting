package com.dke.routingPlanner.repositories;

import com.dke.routingPlanner.entities.RoutePoint;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface RoutePointRepository extends CrudRepository<RoutePoint, Integer> {

    @Transactional
    @Modifying
    @Query("DELETE FROM RoutePoint r WHERE r.routeId = :routeId")
    void deleteByDescription(String routeId);

    List<RoutePoint> findByRouteId(int routeId);
    //List<RoutePoint> findByVehicle(int vehicleId);

}
