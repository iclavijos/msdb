package com.icesoft.msdb.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.icesoft.msdb.domain.SessionLapData;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionLapDataRepository extends MongoRepository<SessionLapData, String>, SessionLapDataCustomRepository {

}
