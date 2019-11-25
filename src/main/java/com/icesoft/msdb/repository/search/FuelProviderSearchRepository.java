package com.icesoft.msdb.repository.search;
import com.icesoft.msdb.domain.FuelProvider;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link FuelProvider} entity.
 */
public interface FuelProviderSearchRepository extends ElasticsearchRepository<FuelProvider, Long> {
}
