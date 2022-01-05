package com.icesoft.msdb.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import com.icesoft.msdb.domain.EventEditionEntry;
import java.util.stream.Stream;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link EventEditionEntry} entity.
 */
public interface EventEntrySearchRepository extends ElasticsearchRepository<EventEditionEntry, Long>, EventEntrySearchRepositoryInternal {}

interface EventEntrySearchRepositoryInternal {
    Stream<EventEditionEntry> search(String query);
}

class EventEntrySearchRepositoryInternalImpl implements EventEntrySearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    EventEntrySearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Stream<EventEditionEntry> search(String query) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        return elasticsearchTemplate.search(nativeSearchQuery, EventEditionEntry.class).map(SearchHit::getContent).stream();
    }
}
