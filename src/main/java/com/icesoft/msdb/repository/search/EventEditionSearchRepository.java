package com.icesoft.msdb.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import com.icesoft.msdb.domain.EventEdition;
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
 * Spring Data Elasticsearch repository for the {@link EventEdition} entity.
 */
public interface EventEditionSearchRepository extends ElasticsearchRepository<EventEdition, Long>, EventEditionSearchRepositoryInternal {}

interface EventEditionSearchRepositoryInternal {
    Page<EventEdition> search(String query, Pageable pageable);
}

class EventEditionSearchRepositoryInternalImpl implements EventEditionSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    EventEditionSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<EventEdition> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<EventEdition> hits = elasticsearchTemplate
            .search(nativeSearchQuery, EventEdition.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
