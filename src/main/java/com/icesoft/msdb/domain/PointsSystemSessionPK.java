package com.icesoft.msdb.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class PointsSystemSessionPK implements Serializable {

	private static final long serialVersionUID = -5431412749175457078L;

	@Column(name = "SESSION_ID")
    private Long sessionId;
	
	@Column(name = "SERIES_EDITION_ID")
	private Long seriesEditionId;

    public PointsSystemSessionPK() {
    	super();
    }
    
	public PointsSystemSessionPK(Long sessionId, Long seriesEditionId) {
		this.sessionId = sessionId;
		this.seriesEditionId = seriesEditionId;
	}

	public Long getSessionId() {
		return sessionId;
	}

	public Long getSeriesEditionId() {
		return seriesEditionId;
	}

	public void setSessionId(Long sessionId) {
		this.sessionId = sessionId;
	}

	public void setSeriesEditionId(Long seriesEditionId) {
		this.seriesEditionId = seriesEditionId;
	}

	@Override
	public String toString() {
		return "PointsSystemSessionPK [sessionId=" + sessionId + ", seriesEditionId=" + seriesEditionId + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((seriesEditionId == null) ? 0 : seriesEditionId.hashCode());
		result = prime * result + ((sessionId == null) ? 0 : sessionId.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		PointsSystemSessionPK other = (PointsSystemSessionPK) obj;
		
		if (seriesEditionId == null) {
			if (other.seriesEditionId != null)
				return false;
		} else if (!seriesEditionId.equals(other.seriesEditionId))
			return false;
		if (sessionId == null) {
			if (other.sessionId != null)
				return false;
		} else if (!sessionId.equals(other.sessionId))
			return false;
		return true;
	}
	
}
