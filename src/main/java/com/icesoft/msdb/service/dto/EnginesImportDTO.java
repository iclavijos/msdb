package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.Engine;
import lombok.Data;

@Data
public class EnginesImportDTO {
	private String name;
    private String manufacturer;
    private Integer capacity;
    private String architecture;
    private Integer debutYear;
    private Boolean petrolEngine;
    private Boolean dieselEngine;
    private Boolean electricEngine;
    private Boolean otherEngine;
    private Boolean turbo;
    private String comments;
    private String derivedFromName;
    private String derivedFromManufacturer;

	public Engine buildEngine() {
		Engine engine = new Engine();

		engine.setName(this.getName());
		engine.setManufacturer(this.manufacturer);
		engine.setArchitecture(this.architecture);
		engine.setCapacity(this.capacity);
		engine.setDebutYear(this.debutYear);
		engine.setPetrolEngine(this.petrolEngine);
		engine.setDieselEngine(this.dieselEngine);
		engine.setElectricEngine(this.electricEngine);
		engine.setOtherEngine(this.otherEngine);
		engine.setTurbo(this.turbo);

		return engine;
	}
}
