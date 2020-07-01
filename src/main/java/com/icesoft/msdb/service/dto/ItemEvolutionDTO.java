package com.icesoft.msdb.service.dto;

import java.util.List;

public abstract class ItemEvolutionDTO {
    private Long id;
    private String name;
    private String manufacturer;
    private List<ItemEvolutionDTO> evolutions;

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

    public List<ItemEvolutionDTO> getEvolutions() {
        return evolutions;
    }

    public void setEvolutions(List<ItemEvolutionDTO> evolutions) {
        this.evolutions = evolutions;
    }
}
