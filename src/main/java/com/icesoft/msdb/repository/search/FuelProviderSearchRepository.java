package com.icesoft.msdb.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import com.icesoft.msdb.domain.FuelProvider;
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
 * Spring Data Elasticsearch repository for the {@link FuelProvider} entity.
 */
public interface FuelProviderSearchRepository extends ElasticsearchRepository<FuelProvider, Long>, FuelProviderSearchRepositoryInternal {}

interface FuelProviderSearchRepositoryInternal {
    Page<FuelProvider> search(String query, Pageable pageable);
}

class FuelProviderSearchRepositoryInternalImpl implements FuelProviderSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    FuelProviderSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<FuelProvider> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<FuelProvider> hits = elasticsearchTemplate
            .search(nativeSearchQuery, FuelProvider.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
