package com.dke.routingPlanner.services;

import com.dke.routingPlanner.entities.Vehicle;
import com.dke.routingPlanner.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository repository;

    public Vehicle saveVehicle(Vehicle vehicle) {
        return repository.save(vehicle);
    }

    public List<Vehicle> saveVehicles(List<Vehicle> vehicles) {
        return (List<Vehicle>) repository.saveAll(vehicles);
    }

    public List<Vehicle> getVehicles() {
        return (List<Vehicle>) repository.findAll();
    }

    public Vehicle getVehicle(int id) {
        return repository.findById(id).orElse(null);
    }

    public String deleteVehicle(int id) {
        repository.deleteById(id);
        return "Vehicle removed " + id;
    }

    public Vehicle updateVehicle(Vehicle vehicle) {
        return repository.save(vehicle);
    }

    public Iterable<Vehicle> getAllVehicles() {
        return repository.findAll();
    }
}
