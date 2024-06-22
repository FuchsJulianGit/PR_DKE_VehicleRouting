package com.dke.routingPlanner.entities;
import jakarta.persistence.*;

@Entity
@Table(name = "ROUTES")
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "route_name", unique = true)
    private String routeName;

    @Column(name = "VEHICLE_ID", nullable = false)
    private int vehicleId;


    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
    }

    public int getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(int vehicleId) {
        this.vehicleId = vehicleId;
    }
}