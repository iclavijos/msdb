package com.icesoft.msdb.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.Search;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.EventEditionEntry;
import com.icesoft.msdb.domain.EventEntryResult;
import com.icesoft.msdb.domain.enums.SessionType;
import com.icesoft.msdb.repository.EventEntryResultRepository;
import com.icesoft.msdb.repository.SearchRepository;
import com.icesoft.msdb.service.SearchService;
import com.icesoft.msdb.service.dto.EventEntrySearchResultDTO;

@Service
@Transactional(readOnly=true)
public class SearchServiceImpl implements SearchService {
	
	private final Logger log = LoggerFactory.getLogger(SearchServiceImpl.class);
	
	private final SearchRepository searchRepository;
	private final EventEntryResultRepository resultsRepo;
	
	@PersistenceContext
	private EntityManager entityManager;
	
	public SearchServiceImpl(SearchRepository searchRepository, EventEntryResultRepository resultsRepo) {
		this.searchRepository = searchRepository;
		this.resultsRepo = resultsRepo;
	}

	@Override
	public void rebuildIndexes() {
		log.debug("REST request to rebuild search indexes");
    	try {
    		FullTextEntityManager fullTextEntityManager =
    				Search.getFullTextEntityManager(entityManager);
    		fullTextEntityManager.createIndexer().startAndWait();
    		log.info("Search indexes rebuilt");
    	} catch (InterruptedException e) {
    		log.error("An error occurred trying to build the search index: ", e);
    	}
	}
	
	@Override
	public Page<EventEntrySearchResultDTO> searchEntries(String searchTems, Pageable pageable) {
		Page<EventEditionEntry> tmp = searchRepository.searchEntries(searchTems, pageable);
		List<EventEntrySearchResultDTO> aux = tmp.getContent().stream()
				.map(entry -> createDTO(entry))
				.collect(Collectors.<EventEntrySearchResultDTO> toList());
		return new PageImpl<>(aux, pageable, tmp.getTotalElements());
	}
	
	@Override
	public Page<EventEdition> searchEventEditions(String searchTems, Pageable pageable) {
		return searchRepository.searchEventEditions(searchTems, pageable);
	}
	
	@Override
	public List<EventEdition> searchRelated(Long eventEditionId) {
		return searchRepository.searchRelated(eventEditionId);
	}
	
	private EventEntrySearchResultDTO createDTO(EventEditionEntry entry) {
		long poleTime;
		Integer polePosition;
		long raceFastLap;
		Integer racePosition;
		String retirement = "";
		long fastestLap;
		String session = "";
		
		List<EventEntryResult> results = resultsRepo.findByEntryId(entry.getId());
		
		List<EventEntryResult> qResults = results.stream()
				.filter(r -> r.getSession().getSessionType() == SessionType.QUALIFYING).collect(Collectors.<EventEntryResult> toList());
		if (qResults != null && !qResults.isEmpty()) {
			poleTime = qResults.get(0).getBestLapTime() != null ? qResults.get(0).getBestLapTime() : 0;
			polePosition = qResults.get(0).getFinalPosition();
		} else {
			poleTime = 0;
			polePosition = 0;
		}
		
		List<EventEntryResult> rResults = results.stream()
				.filter(r -> r.getSession().getSessionType() == SessionType.RACE).collect(Collectors.<EventEntryResult> toList());
		if (rResults != null && !rResults.isEmpty()) {
			EventEntryResult result = rResults.get(0);
			if (result.isRetired()) {
				raceFastLap = 0;
				retirement = result.getCause();
			} else {
				if (result.getBestLapTime() != null) {
					raceFastLap = result.getBestLapTime();
				} else {
					raceFastLap = 0;
				}
			}
			racePosition = result.getFinalPosition();
		} else {
			raceFastLap = 0;
			racePosition = 0;
		}
		
		fastestLap = Long.MAX_VALUE;
		for(EventEntryResult result : results) {
			if (result.getBestLapTime() != null && result.getBestLapTime() != 0) {
				if (result.getBestLapTime() < fastestLap) {
					fastestLap = result.getBestLapTime();
					session = result.getSession().getShortname();
				}
			}
		}
		if (fastestLap == Long.MAX_VALUE) {
			fastestLap = 0;
		}
		
		EventEntrySearchResultDTO dto = new EventEntrySearchResultDTO(entry, poleTime, raceFastLap, polePosition, 
				racePosition, retirement, fastestLap, session);
		
		return dto;
	}

}
