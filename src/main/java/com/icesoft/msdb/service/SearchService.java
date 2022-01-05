package com.icesoft.msdb.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.icesoft.msdb.service.dto.EventEntrySearchResultDTO;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.stream.Stream;

public interface SearchService {

    void rebuildIndexes();

    <T> Page<T> performWildcardSearch(final Class searchClass, String query, List<String> fields, Pageable pageable);

	// public Page<EventEntrySearchResultDTO> searchEntries(String searchTems, Pageable pageable);
}
