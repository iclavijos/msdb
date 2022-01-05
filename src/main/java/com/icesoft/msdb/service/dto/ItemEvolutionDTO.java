package com.icesoft.msdb.service.dto;

import lombok.Data;

import java.util.List;

@Data
public abstract class ItemEvolutionDTO {
    private Long id;
    private String name;
    private String manufacturer;
    private List<ItemEvolutionDTO> evolutions;

}
