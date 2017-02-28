package com.icesoft.msdb.repository.search;

import com.icesoft.msdb.domain.Driver;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Driver entity.
 */
public interface DriverSearchRepository extends ElasticsearchRepository<Driver, Long> {
}
