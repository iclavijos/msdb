package com.icesoft.msdb.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import com.icesoft.msdb.domain.TyreProvider;
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
 * Spring Data Elasticsearch repository for the {@link TyreProvider} entity.
 */
public interface TyreProviderSearchRepository extends ElasticsearchRepository<TyreProvider, Long>, TyreProviderSearchRepositoryInternal {}

interface TyreProviderSearchRepositoryInternal {
    Page<TyreProvider> search(String query, Pageable pageable);
}

class TyreProviderSearchRepositoryInternalImpl implements TyreProviderSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    TyreProviderSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<TyreProvider> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<TyreProvider> hits = elasticsearchTemplate
            .search(nativeSearchQuery, TyreProvider.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
