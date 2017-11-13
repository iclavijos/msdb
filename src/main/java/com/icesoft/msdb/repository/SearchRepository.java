package com.icesoft.msdb.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.EventEditionEntry;

@Repository
public interface SearchRepository {

//	public Page<EventEdition> searchEventEditions(String searchTems, Pageable pageable);
//	
//	public Page<EventEditionEntry> searchEntries(String searchTems, Pageable pageable);
//	
//	public List<EventEdition> searchRelated(Long eventEditionId);
}
