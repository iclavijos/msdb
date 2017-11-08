package com.icesoft.msdb.repository.search;

import com.icesoft.msdb.domain.Series;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Series entity.
 */
public interface SeriesSearchRepository extends ElasticsearchRepository<Series, Long> {
}
