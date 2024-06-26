package com.dke.routingPlanner.entities;
import jakarta.persistence.*;

@Entity
@Table(name = "ROUTE_POINT")
public class RoutePoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "ROUTE_ID")
    private int routeId;

    @Column(name = "SEQUENCE")
    private int sequence;

    @Column(name = "ATHOME")
    private boolean atHome;

    @Column(name = "VEHICLE_ID")
    private int vehicleId;

    @Column(name = "COORDINATE_ID")
    private int coordinateId;


    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getRouteId() {
        return routeId;
    }

    public void setDescription(Integer routeId) {
        this.routeId = routeId;
    }

    public int getSequenz() {
        return sequence;
    }

    public void setSequenz(int sequenz) {
        this.sequence = sequenz;
    }

    public boolean isAtHome() {
        return atHome;
    }

    public void setAtHome(boolean atHome) {
        this.atHome = atHome;
    }

    public int getCoordinates() {
        return coordinateId;
    }

    public void setCoordinates(Integer coordinateId) {
        this.coordinateId = coordinateId;
    }

    public int getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(int vehicleId) {
        this.vehicleId = vehicleId;
    }

    public int getCoordinateId() {
        return coordinateId;
    }

    public void setCoordinateId(int coordinateId) {
        this.coordinateId = coordinateId;
    }

    public Object getSequence() {
        return this.sequence;
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


