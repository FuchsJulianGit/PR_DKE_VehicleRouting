package com.dke.routingPlanner.entities;
import jakarta.persistence.*;

@Entity
@Table(name = "ROUTE_POINTS")
public class RoutePoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "SEQ")
    private int seq;

    @Column(name = "START_POINT")
    private int startPoint;

    @Column(name = "PERSON")
    private int person;


    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getSeq() {
        return seq;
    }

    public void setSeq(int seq) { this.seq = seq; }

    public int getStartPoint() {
        return startPoint;
    }

    public void setStartPoint(int startPoint) {
        this.startPoint = startPoint;
    }

    public int getPerson() {
        return person;
    }

    public void setPerson(int person) {
        this.person = person;
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


