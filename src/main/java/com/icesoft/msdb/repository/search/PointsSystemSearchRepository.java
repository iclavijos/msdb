package com.icesoft.msdb.repository.search;

import com.icesoft.msdb.domain.PointsSystem;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the PointsSystem entity.
 */
public interface PointsSystemSearchRepository extends ElasticsearchRepository<PointsSystem, Long> {
}
