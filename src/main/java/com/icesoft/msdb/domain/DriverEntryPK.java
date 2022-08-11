package com.icesoft.msdb.domain;

import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
public class DriverEntryPK implements Serializable {

	private static final long serialVersionUID = -5431412749175457078L;

	@Column(name = "driver_id")
    private Long driverId;

	@Column(name = "entry_id")
	private Long entryId;

	public DriverEntryPK(Long driverId, Long entryId) {
		this.driverId = driverId;
		this.entryId = entryId;
	}

}
