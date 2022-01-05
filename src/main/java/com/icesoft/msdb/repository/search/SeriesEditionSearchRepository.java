package com.icesoft.msdb.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import com.icesoft.msdb.domain.SeriesEdition;
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
 * Spring Data Elasticsearch repository for the {@link SeriesEdition} entity.
 */
public interface SeriesEditionSearchRepository
    extends ElasticsearchRepository<SeriesEdition, Long>, SeriesEditionSearchRepositoryInternal {}

interface SeriesEditionSearchRepositoryInternal {
    Page<SeriesEdition> search(String query, Pageable pageable);
}

class SeriesEditionSearchRepositoryInternalImpl implements SeriesEditionSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    SeriesEditionSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<SeriesEdition> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<SeriesEdition> hits = elasticsearchTemplate
            .search(nativeSearchQuery, SeriesEdition.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
