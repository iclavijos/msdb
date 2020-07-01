package com.icesoft.msdb.repository.search;
import com.icesoft.msdb.domain.Racetrack;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Racetrack} entity.
 */
public interface RacetrackSearchRepository extends ElasticsearchRepository<Racetrack, Long> {
}
