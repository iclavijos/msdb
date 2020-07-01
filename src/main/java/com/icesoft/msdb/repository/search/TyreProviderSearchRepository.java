package com.icesoft.msdb.repository.search;
import com.icesoft.msdb.domain.TyreProvider;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link TyreProvider} entity.
 */
public interface TyreProviderSearchRepository extends ElasticsearchRepository<TyreProvider, Long> {
}
