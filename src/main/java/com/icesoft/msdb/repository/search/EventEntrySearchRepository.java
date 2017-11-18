package com.icesoft.msdb.repository.search;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.icesoft.msdb.domain.EventEditionEntry;

/**
 * Spring Data Elasticsearch repository for the EventEntry entity.
 */
public interface EventEntrySearchRepository extends ElasticsearchRepository<EventEditionEntry, Long> {
}
