package com.icesoft.msdb.repository.search;
import com.icesoft.msdb.domain.EventEdition;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link EventEdition} entity.
 */
public interface EventEditionSearchRepository extends ElasticsearchRepository<EventEdition, Long> {
}
