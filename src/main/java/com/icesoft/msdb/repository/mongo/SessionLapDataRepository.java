package com.icesoft.msdb.repository.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.icesoft.msdb.domain.SessionLapData;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionLapDataRepository extends MongoRepository<SessionLapData, String>, SessionLapDataCustomRepository {

}
