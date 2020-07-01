package com.icesoft.msdb.repository.search;
import com.icesoft.msdb.domain.Chassis;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Chassis} entity.
 */
public interface ChassisSearchRepository extends ElasticsearchRepository<Chassis, Long> {
}
