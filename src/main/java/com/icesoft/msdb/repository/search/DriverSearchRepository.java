package com.icesoft.msdb.repository.search;
import com.icesoft.msdb.domain.Driver;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Driver} entity.
 */
public interface DriverSearchRepository extends ElasticsearchRepository<Driver, Long> {
	
	Page<Driver> findBySurnameContains(String surname, Pageable pageable);
}
