package com.icesoft.msdb.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import com.icesoft.msdb.domain.RacetrackLayout;
import java.util.stream.Stream;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link RacetrackLayout} entity.
 */
public interface RacetrackLayoutSearchRepository
    extends ElasticsearchRepository<RacetrackLayout, Long>, RacetrackLayoutSearchRepositoryInternal {}

interface RacetrackLayoutSearchRepositoryInternal {
    Stream<RacetrackLayout> search(String query);
}

class RacetrackLayoutSearchRepositoryInternalImpl implements RacetrackLayoutSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    RacetrackLayoutSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Stream<RacetrackLayout> search(String query) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        return elasticsearchTemplate.search(nativeSearchQuery, RacetrackLayout.class).map(SearchHit::getContent).stream();
    }
}
