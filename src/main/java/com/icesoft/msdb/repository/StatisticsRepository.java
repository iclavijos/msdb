package com.icesoft.msdb.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.icesoft.msdb.domain.Statistics;

public interface StatisticsRepository extends MongoRepository<Statistics, Long> {

}
