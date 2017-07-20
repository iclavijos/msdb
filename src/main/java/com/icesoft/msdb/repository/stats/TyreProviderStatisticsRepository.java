package com.icesoft.msdb.repository.stats;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.icesoft.msdb.domain.stats.TyreProviderStatistics;

public interface TyreProviderStatisticsRepository extends MongoRepository<TyreProviderStatistics, String> {

}
