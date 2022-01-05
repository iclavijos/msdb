package com.icesoft.msdb.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import com.icesoft.msdb.domain.Racetrack;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Racetrack} entity.
 */
public interface RacetrackSearchRepository extends ElasticsearchRepository<Racetrack, Long>, RacetrackSearchRepositoryInternal {}

interface RacetrackSearchRepositoryInternal {
    Page<Racetrack> search(String query, Pageable pageable);
}

class RacetrackSearchRepositoryInternalImpl implements RacetrackSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    RacetrackSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<Racetrack> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<Racetrack> hits = elasticsearchTemplate
            .search(nativeSearchQuery, Racetrack.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
