package com.dke.routingPlanner.entities;
import jakarta.persistence.*;

@Entity
@Table(name = "PERSON")
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "START_COORDINATE")
    private String startCoordinate;

    @Column(name = "END_COORDINATE")
    private String endCoordinate;

    @Column(name = "COMPANY")
    private String company;

    @Column(name = "NEEDS_WHEELCHAIR")
    private boolean needsWheelchair;

    // Constructors, getters, and setters
    public Person() {
    }

    public Person(String name, String startCoordinate, String endCoordinate, String company, boolean needsWheelchair) {
        this.name = name;
        this.startCoordinate = startCoordinate;
        this.endCoordinate = endCoordinate;
        this.company = company;
        this.needsWheelchair = needsWheelchair;
    }

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStartCoordinate() {
        return startCoordinate;
    }

    public void setStartCoordinate(String startCoordinate) {
        this.startCoordinate = startCoordinate;
    }

    public String getEndCoordinate() {
        return endCoordinate;
    }

    public void setEndCoordinate(String endCoordinate) {
        this.endCoordinate = endCoordinate;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public boolean isNeedsWheelchair() {
        return needsWheelchair;
    }

    public void setNeedsWheelchair(boolean needsWheelchair) {
        this.needsWheelchair = needsWheelchair;
    }
}
