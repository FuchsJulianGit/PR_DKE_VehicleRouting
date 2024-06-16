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

    @Column(name = "START_COORDINATE")
    private String startCoordinate;

    @Column(name = "END_COORDINATE")
    private String endCoordinate;

    @Column(name = "CAN_TRANSPORT_WHEELCHAIRS")
    private boolean canTransportWheelchairs;

    @Column(name = "SEATING_PLACES")
    private int seatingPlaces;

    // Constructors, getters, and setters
    public Vehicle() {
    }

    public Vehicle(String companyName, String vehicleDescription, String startCoordinate, String endCoordinate, boolean canTransportWheelchairs, int seatingPlaces) {
        this.companyName = companyName;
        this.vehicleDescription = vehicleDescription;
        this.startCoordinate = startCoordinate;
        this.endCoordinate = endCoordinate;
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

    public String getStartCoordinate() {
        return startCoordinate;
    }

    public void setStartCoordinate(String coordinate) {
        this.startCoordinate = coordinate;
    }

    public String getEndCoordinate() {
        return endCoordinate;
    }

    public void setEndCoordinate(String coordinate) {
        this.endCoordinate = coordinate;
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
