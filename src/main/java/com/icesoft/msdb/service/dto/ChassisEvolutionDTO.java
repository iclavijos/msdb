package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.Chassis;

import java.util.List;
import java.util.stream.Collectors;

public class ChassisEvolutionDTO extends ItemEvolutionDTO {

    public ChassisEvolutionDTO(Chassis chassis) {
        setId(chassis.getId());
        setName(chassis.getName());
        setManufacturer(chassis.getManufacturer());
        setEvolutions(chassis.getEvolutions().stream().map(evolution -> new ChassisEvolutionDTO(evolution)).collect(Collectors.toList()));
    }
}
