package com.icesoft.msdb.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.icesoft.msdb.domain.stats.DriverStatistics;

public interface DriverStatisticsRepository extends MongoRepository<DriverStatistics, String> {

}
