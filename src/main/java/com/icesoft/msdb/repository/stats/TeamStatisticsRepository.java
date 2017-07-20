package com.icesoft.msdb.repository.stats;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.icesoft.msdb.domain.stats.TeamStatistics;

public interface TeamStatisticsRepository extends MongoRepository<TeamStatistics, String> {

}
