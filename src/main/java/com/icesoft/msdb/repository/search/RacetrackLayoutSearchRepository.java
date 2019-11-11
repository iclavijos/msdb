package com.icesoft.msdb.repository.search;
import com.icesoft.msdb.domain.RacetrackLayout;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link RacetrackLayout} entity.
 */
public interface RacetrackLayoutSearchRepository extends ElasticsearchRepository<RacetrackLayout, Long> {
}
