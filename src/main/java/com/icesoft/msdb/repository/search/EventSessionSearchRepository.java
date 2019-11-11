package com.icesoft.msdb.repository.search;
import com.icesoft.msdb.domain.EventSession;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link EventSession} entity.
 */
public interface EventSessionSearchRepository extends ElasticsearchRepository<EventSession, Long> {
}
