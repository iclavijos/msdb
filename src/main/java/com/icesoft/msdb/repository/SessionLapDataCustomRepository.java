package com.icesoft.msdb.repository;

import java.util.List;

import com.icesoft.msdb.domain.SessionLapData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

public interface SessionLapDataCustomRepository {

	boolean anyEventSessionHasLapDataLoaded(Long sessionId);

    boolean sessionHasLapDataLoaded(Long eventSessionId);

	List<SessionLapData> getDriverLaps(String id, String raceNumber);
}
