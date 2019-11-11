package com.icesoft.msdb.repository.search;
import com.icesoft.msdb.domain.DriverPointsDetails;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link DriverPointsDetails} entity.
 */
public interface DriverPointsDetailsSearchRepository extends ElasticsearchRepository<DriverPointsDetails, Long> {
}
