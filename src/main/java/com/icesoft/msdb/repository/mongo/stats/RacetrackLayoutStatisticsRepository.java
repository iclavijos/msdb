package com.icesoft.msdb.repository.mongo.stats;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.icesoft.msdb.domain.stats.RacetrackLayoutStatistics;

public interface RacetrackLayoutStatisticsRepository extends MongoRepository<RacetrackLayoutStatistics, String> {

}
