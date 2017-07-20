package com.icesoft.msdb.repository.stats;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.icesoft.msdb.domain.stats.EngineStatistics;

public interface EngineStatisticsRepository extends MongoRepository<EngineStatistics, String> {

}
