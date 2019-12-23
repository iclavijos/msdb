package com.icesoft.msdb.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.icesoft.msdb.service.dto.EventEntrySearchResultDTO;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.stream.Stream;

public interface SearchService {

	public void rebuildIndexes();

    public <T> Page<T> performWildcardSearch(final ElasticsearchRepository<T, Long> searchRepo, String query, String[] fields, Pageable pageable);

	public Page<EventEntrySearchResultDTO> searchEntries(String searchTems, Pageable pageable);
}
