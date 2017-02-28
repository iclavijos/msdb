package com.icesoft.msdb.repository.search;

import com.icesoft.msdb.domain.EventEntry;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the EventEntry entity.
 */
public interface EventEntrySearchRepository extends ElasticsearchRepository<EventEntry, Long> {
}
