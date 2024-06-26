package com.dke.routingPlanner.services;

import com.dke.routingPlanner.entities.RoutePoint;
import com.dke.routingPlanner.repositories.RoutePointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RoutePointService {

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

    /*public List<RoutePoint> getRoutePointByVehicleId(int vehicleId) {
        return (List<RoutePoint>) repository.findByVehicle(vehicleId);
    }*/



    public RoutePoint getRoutePoint(int id) {
        return repository.findById(id).orElse(null);
    }

    public String deleteRoutePoint(int id) {
        repository.deleteById(id);
        return "Point removed " + id;
    }

    public String deleteRoutePointsByDescription(String ROUTE_ID) {
        System.out.print("Delete");
        repository.deleteByDescription(ROUTE_ID);
        return "Route removed " + ROUTE_ID;
    }

    public RoutePoint updateRoutePoint(RoutePoint routePoint) {
        /*RoutePoint existingRoutePoint= repository.findById(routePoint.getId()).orElse(null);
        existingRoutePoint.setSeq(routePoint.getSeq());
        existingRoutePoint.setStartPoint(routePoint.getStartPoint());
        existingRoutePoint.setPerson(routePoint.getPerson());
        return repository.save(existingRoutePoint);*/
        return repository.save(routePoint);
    }

    public Iterable<RoutePoint> getAllRoutePoints() {
        return repository.findAll();
    }


    public List<Map<String, Object>> getRoutesWithPointsPath() {
        List<RoutePoint> routePointsAtHome = repository.findByAtHome(true);
        return routePointsAtHome.stream()
                .map(this::convertToRoutePointMap)
                .collect(Collectors.toList());
    }

    public void deleteRoutePointsByRouteId(int routeId) {
        repository.deleteByRouteId(routeId);
    }

    private Map<String, Object> convertToRoutePointMap(RoutePoint routePoint) {
        return Map.of(
                "id", routePoint.getId(),
                "routeId", routePoint.getRouteId(),
                "sequence", routePoint.getSequence(),
                "atHome", routePoint.isAtHome(),
                "vehicleId", routePoint.getVehicleId(),
                "coordinateId", routePoint.getCoordinateId()
        );
    }

}
