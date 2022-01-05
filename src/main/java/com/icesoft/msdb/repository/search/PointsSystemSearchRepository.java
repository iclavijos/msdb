package com.icesoft.msdb.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import com.icesoft.msdb.domain.PointsSystem;
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
 * Spring Data Elasticsearch repository for the {@link PointsSystem} entity.
 */
public interface PointsSystemSearchRepository extends ElasticsearchRepository<PointsSystem, Long>, PointsSystemSearchRepositoryInternal {}

interface PointsSystemSearchRepositoryInternal {
    Page<PointsSystem> search(String query, Pageable pageable);
}

class PointsSystemSearchRepositoryInternalImpl implements PointsSystemSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    PointsSystemSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<PointsSystem> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<PointsSystem> hits = elasticsearchTemplate
            .search(nativeSearchQuery, PointsSystem.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
