package com.icesoft.msdb.repository;

import java.util.List;

import com.icesoft.msdb.domain.SessionLapData;

public interface SessionLapDataCustomRepository {

	boolean sessionLapDataLoaded(Long sessionId);
	
	List<SessionLapData> getDriverLaps(String id, String raceNumber);
	
	List<String> getDriverNamesWithData(String sessionId);
}
