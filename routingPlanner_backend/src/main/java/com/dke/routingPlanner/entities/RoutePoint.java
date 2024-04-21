package com.dke.routingPlanner.entities;
import jakarta.persistence.*;

@Entity
@Table(name = "ROUTE_POINTS")
public class RoutePoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "SEQUENZ")
    private int sequenz;

    @Column(name = "ATHOME")
    private boolean atHome;
    @Column(name = "COORDINATES")
    private String coordinates;

    @Column(name = "VEHICLE")
    private int vehicle;

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getSequenz() {
        return sequenz;
    }

    public void setSequenz(int sequenz) {
        this.sequenz = sequenz;
    }

    public boolean isAtHome() {
        return atHome;
    }

    public void setAtHome(boolean atHome) {
        this.atHome = atHome;
    }

    public String getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    public int getVehicle() {
        return vehicle;
    }

    public void setVehicle(int vehicle) {
        this.vehicle = vehicle;
    }
}




 /*   @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer id = 1;
    @Column(name = "seq")
    private Integer seq = 2;
    @Column(name = "start_point")
    private Integer start_point = 10;
    @Column(name = "person")
    private Integer person = 1;

    public void setId(Integer id) {
        this.id = id;
    }
    public Integer getId() {
        return id;
    }

    public void setSeq(Integer seq) {
        this.seq = seq;
    }
    public Integer getSeq() {
        return seq;
    }

    public void setStartPoint(Integer start_point) {
        this.start_point = start_point;
    }
    public Integer getStartPoint() {
        return start_point;
    }

    public void setPerson(Integer Person) {
        this.person = Person;
    }
    public Integer getPerson() {
        return person;
    }

    /*public route_points(int id, int seq, int Person, boolean start) {
        this.id = id;
        this.seq = seq;
        this.Person = Person;
        this.start = start;
    }*/


