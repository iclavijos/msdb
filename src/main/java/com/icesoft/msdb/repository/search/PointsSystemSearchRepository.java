package com.icesoft.msdb.repository.search;
import com.icesoft.msdb.domain.PointsSystem;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link PointsSystem} entity.
 */
public interface PointsSystemSearchRepository extends ElasticsearchRepository<PointsSystem, Long> {
}
