package com.icesoft.msdb.repository.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.icesoft.msdb.domain.SessionLapData;
import com.icesoft.msdb.repository.SessionLapDataCustomRepository;

public class SessionLapDataRepositoryImpl implements SessionLapDataCustomRepository {
	
	@Autowired MongoTemplate template;

	@Override
	public boolean sessionLapDataLoaded(Long sessionId) {
		String id = sessionId.toString();
		
		Query query = new Query(Criteria.where("_id").is(id));
		long count = template.count(query, SessionLapData.class);
		
		return count > 0;
	}

}
