package com.icesoft.msdb.repository.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.icesoft.msdb.domain.SessionLapData;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.SessionLapDataCustomRepository;
import org.springframework.data.mongodb.repository.query.MongoEntityInformation;
import org.springframework.data.mongodb.repository.support.SimpleMongoRepository;

public class SessionLapDataRepositoryImpl implements SessionLapDataCustomRepository {

	@Autowired MongoOperations mongoOps;
	@Autowired MongoTemplate template;
	@Autowired EventSessionRepository sessionsRepo;

    @Override
	public boolean sessionLapDataLoaded(Long sessionId) {
		List<String> sessions = sessionsRepo.findByEventEditionIdOrderBySessionStartTimeAsc(sessionId).parallelStream()
				.map(es -> es.getId().toString()).collect(Collectors.toList());

		Query query = new Query(Criteria.where("_id").in(sessions));
		long count = template.count(query, SessionLapData.class);

		return count > 0;
	}

	public List<SessionLapData> getDriverLaps(String id, String raceNumber) {
		List<AggregationOperation> list = new ArrayList<>();
		list.add(Aggregation.match(Criteria.where("_id").is(id)));
	    list.add(Aggregation.unwind("laps"));
	    list.add(Aggregation.match(Criteria.where("laps.raceNumber").is(raceNumber)));
	    list.add(Aggregation.group("sessionId").push("laps").as("laps"));
	    list.add(Aggregation.project("sessionId", "laps"));
	    TypedAggregation<SessionLapData> agg = Aggregation.newAggregation(SessionLapData.class, list);
	    return mongoOps.aggregate(agg, SessionLapData.class, SessionLapData.class).getMappedResults();
	}

	@Override
	public List<String> getDriverNamesWithData(String sessionId) {
		List<AggregationOperation> list = new ArrayList<>();
		list.add(Aggregation.match(Criteria.where("_id").is(sessionId)));

		return null;
	}

}
