package com.dke.routingPlanner.controller;

import com.dke.routingPlanner.entities.Person;
import com.dke.routingPlanner.services.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PersonController {

    @Autowired
    private PersonService personService;

    @PostMapping("/addPerson")
    public Person addPerson(@RequestBody Person person) {
        return personService.savePerson(person);
    }

    @GetMapping("/person")
    public Iterable<Person> findAllPerson() {
        return personService.getAllPerson();
    }

    @GetMapping("/person/{id}")
    public Person findPersonById(@PathVariable int id) {
        return personService.getPerson(id);
    }

    @PutMapping("/updatePerson")
    public Person updatePerson(@RequestBody Person person) {
        return personService.updatePerson(person);
    }

    @DeleteMapping("/deletePerson/{id}")
    public String deletePerson(@PathVariable int id) {
        return personService.deletePerson(id);
    }
}
