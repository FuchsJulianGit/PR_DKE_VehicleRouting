package com.dke.routingPlanner.services;

import com.dke.routingPlanner.entities.Person;
import com.dke.routingPlanner.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonService {

    @Autowired
    private PersonRepository repository;

    public Person savePerson(Person person) {
        return repository.save(person);
    }

    public List<Person> savePeople(List<Person> people) {
        return (List<Person>) repository.saveAll(people);
    }

    public List<Person> getPeople() {
        return (List<Person>) repository.findAll();
    }

    public Person getPerson(int id) {
        return repository.findById(id).orElse(null);
    }

    public String deletePerson(int id) {
        repository.deleteById(id);
        return "Person removed " + id;
    }

    public Person updatePerson(Person person) {
        return repository.save(person);
    }

    public Iterable<Person> getAllPeople() {
        return repository.findAll();
    }
}
