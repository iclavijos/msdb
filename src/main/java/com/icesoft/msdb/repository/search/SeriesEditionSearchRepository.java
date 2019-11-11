package com.icesoft.msdb.repository.search;

import com.icesoft.msdb.domain.SeriesEdition;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the SeriesEdition entity.
 */
public interface SeriesEditionSearchRepository extends ElasticsearchRepository<SeriesEdition, Long> {
}
