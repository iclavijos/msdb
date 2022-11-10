package com.icesoft.msdb.domain;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data @AllArgsConstructor @NoArgsConstructor
public class PointsSystemSessionPK implements Serializable {

	private static final long serialVersionUID = -5431412749175457078L;

	@Column(name = "SESSION_ID")
    private Long sessionId;

	@Column(name = "SERIES_EDITION_ID")
	private Long seriesEditionId;

    @Column(name = "POINTS_SYSTEM_ID")
    private Long pointsSystemId;

}
