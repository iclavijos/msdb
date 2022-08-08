package com.icesoft.msdb.repository.mongo.stats;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.icesoft.msdb.domain.stats.ChassisStatistics;

public interface ChassisStatisticsRepository extends MongoRepository<ChassisStatistics, String> {

}
