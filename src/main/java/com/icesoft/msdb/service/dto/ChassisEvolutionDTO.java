package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.Chassis;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ChassisEvolutionDTO {
    private Long id;
    private String name;
    private String manufacturer;
    private List<ChassisEvolutionDTO> evolutions;

    public ChassisEvolutionDTO(Chassis chassis) {
        this.id = chassis.getId();
        this.name = chassis.getName();
        this.manufacturer = chassis.getManufacturer();
        this.evolutions = chassis.getEvolutions().stream().map(evolution -> new ChassisEvolutionDTO(evolution)).collect(Collectors.toList());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public List<ChassisEvolutionDTO> getEvolutions() {
        return evolutions;
    }

    public void setEvolutions(List<ChassisEvolutionDTO> evolutions) {
        this.evolutions = evolutions;
    }
}
