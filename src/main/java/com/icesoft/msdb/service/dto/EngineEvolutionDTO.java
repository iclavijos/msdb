package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.Engine;

import java.util.stream.Collectors;

public class EngineEvolutionDTO extends ItemEvolutionDTO {

    public EngineEvolutionDTO(Engine engine) {
        setId(engine.getId());
        setName(engine.getName());
        setManufacturer(engine.getManufacturer());
        setEvolutions(engine.getEvolutions().stream().map(evolution -> new EngineEvolutionDTO(evolution)).collect(Collectors.toList()));
    }
}
