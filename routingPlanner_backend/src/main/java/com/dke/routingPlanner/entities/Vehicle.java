package com.dke.routingPlanner.entities;
import jakarta.persistence.*;

@Entity
@Table(name = "VEHICLES")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "COMPANY_NAME")
    private String companyName;

    @Column(name = "VEHICLE_DESCRIPTION")
    private String vehicleDescription;

    @Column(name = "COORDINATE")
    private String coordinate;

    @Column(name = "CAN_TRANSPORT_WHEELCHAIRS")
    private boolean canTransportWheelchairs;

    @Column(name = "SEATING_PLACES")
    private int seatingPlaces;

    // Constructors, getters, and setters
    public Vehicle() {
    }

    public Vehicle(String companyName, String vehicleDescription, String coordinate, boolean canTransportWheelchairs, int seatingPlaces) {
        this.companyName = companyName;
        this.vehicleDescription = vehicleDescription;
        this.coordinate = coordinate;
        this.canTransportWheelchairs = canTransportWheelchairs;
        this.seatingPlaces = seatingPlaces;
    }

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getVehicleDescription() {
        return vehicleDescription;
    }

    public void setVehicleDescription(String vehicleDescription) {
        this.vehicleDescription = vehicleDescription;
    }

    public String getCoordinate() {
        return coordinate;
    }

    public void setCoordinate(String coordinate) {
        this.coordinate = coordinate;
    }

    public boolean isCanTransportWheelchairs() {
        return canTransportWheelchairs;
    }

    public void setCanTransportWheelchairs(boolean canTransportWheelchairs) {
        this.canTransportWheelchairs = canTransportWheelchairs;
    }

    public int getSeatingPlaces() {
        return seatingPlaces;
    }

    public void setSeatingPlaces(int seatingPlaces) {
        this.seatingPlaces = seatingPlaces;
    }
}
