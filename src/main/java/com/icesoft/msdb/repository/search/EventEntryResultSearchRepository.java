package com.icesoft.msdb.repository.search;
import com.icesoft.msdb.domain.EventEntryResult;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link EventEntryResult} entity.
 */
public interface EventEntryResultSearchRepository extends ElasticsearchRepository<EventEntryResult, Long> {
}
