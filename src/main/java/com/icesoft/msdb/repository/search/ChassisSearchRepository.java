package com.icesoft.msdb.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import com.icesoft.msdb.domain.Chassis;
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
 * Spring Data Elasticsearch repository for the {@link Chassis} entity.
 */
public interface ChassisSearchRepository extends ElasticsearchRepository<Chassis, Long>, ChassisSearchRepositoryInternal {}

interface ChassisSearchRepositoryInternal {
    Page<Chassis> search(String query, Pageable pageable);
}

class ChassisSearchRepositoryInternalImpl implements ChassisSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    ChassisSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<Chassis> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<Chassis> hits = elasticsearchTemplate
            .search(nativeSearchQuery, Chassis.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
