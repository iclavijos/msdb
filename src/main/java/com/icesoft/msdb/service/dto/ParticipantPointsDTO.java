package com.icesoft.msdb.service.dto;

import com.fasterxml.jackson.annotation.JsonView;
import com.icesoft.msdb.web.rest.views.ResponseViews;

public class ParticipantPointsDTO {

	@JsonView(ResponseViews.ParticipantPointsDetailView.class)
	private final Long id;
	private final Long participantId;
	@JsonView(ResponseViews.ParticipantPointsDetailView.class)
	private final String participantName;
	@JsonView(ResponseViews.ParticipantPointsDetailView.class)
	private final Float points;
	private final Integer numPoints;
	@JsonView(ResponseViews.ParticipantPointsDetailView.class)
	private final String reason;
	private final String category;

	public ParticipantPointsDTO(Long id, Long participantId, String participantName, Float points, String category) {
		this(id, participantId, participantName, points, 1, category, "");
	}

	public ParticipantPointsDTO(Long id, String participantName, Float points, String reason, String category) {
		this(id, null, participantName, points, 0, category, reason);
	}

	public ParticipantPointsDTO(Long participantId, String participantName, Float points, String category) {
	    this(null, participantId, participantName, points, null, category, null);
    }

	public ParticipantPointsDTO(Long id, Long participantId, String participantName, Float points, Integer numPoints, String category, String reason) {
		super();
		this.id = id;
		this.participantId = participantId;
		this.participantName = participantName;
		this.points = points;
		this.numPoints = numPoints;
		this.category = category;
		this.reason = reason;
	}

	public Long getId() {
		return id;
	}

	public Long getParticipantId() {
		return participantId;
	}

	public String getParticipantName() {
		return participantName;
	}

	public Float getPoints() {
		return points;
	}

	public Integer getNumPoints() {
		return numPoints;
	}

	public String getReason() {
		return reason;
	}

	public String getCategory() { return category; }
}
