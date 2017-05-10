package com.icesoft.msdb.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.service.dto.EventEntrySearchResultDTO;

public interface SearchService {

	public void rebuildIndexes();
	
	public Page<EventEntrySearchResultDTO> searchEntries(String searchTems, Pageable pageable);
	
	public Page<EventEdition> searchEventEditions(String searchTems, Pageable pageable);
}
