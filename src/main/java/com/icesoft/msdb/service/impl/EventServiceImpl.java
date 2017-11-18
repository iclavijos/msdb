package com.icesoft.msdb.service.impl;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.util.List;
import java.util.stream.Collectors;

import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.sort.SortBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.Event;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.EventRepository;
import com.icesoft.msdb.repository.search.EventSearchRepository;
import com.icesoft.msdb.service.EventService;
import com.icesoft.msdb.service.dto.EventEditionIdYearDTO;

/**
 * Service Implementation for managing Events.
 */
@Service
@Transactional
public class EventServiceImpl implements EventService {

    private final Logger log = LoggerFactory.getLogger(EventServiceImpl.class);
    
    private final EventRepository eventRepository;
    private final EventEditionRepository eventEditionRepository;
    private final EventSearchRepository eventSearchRepo;
    
    public EventServiceImpl(EventRepository eventRepository, 
    			EventEditionRepository eventEditionRepository,
    			EventSearchRepository eventSearchRepo) {
    	this.eventRepository = eventRepository;
    	this.eventEditionRepository = eventEditionRepository;
    	this.eventSearchRepo = eventSearchRepo;
    }

    /**
     * Save a racetrack.
     *
     * @param racetrack the entity to save
     * @return the persisted entity
     */
    @Override
    public Event save(Event event) {
        log.debug("Request to save Event : {}", event);
        Event result = eventRepository.save(event);
        eventSearchRepo.save(result);
        return result;
    }

    /**
     *  Get all the racetracks.
     *  
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Event> findAll(Pageable pageable) {
        log.debug("Request to get all Events");
        Page<Event> result = eventRepository.findAll(pageable);
        return result;
    }

    /**
     *  Get one racetrack by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Event findOne(Long id) {
        log.debug("Request to get Event : {}", id);
        Event event = eventRepository.findOne(id);
        return event;
    }

    /**
     *  Delete the  racetrack by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Event : {}", id);
        eventRepository.delete(id);
        eventSearchRepo.delete(id);
    }
    
    @Override
    public Page<Event> search(String query, Pageable pageable) {
    	String searchValue = "name:*" + query + '*';
    	NativeSearchQueryBuilder nqb = new NativeSearchQueryBuilder()
        		.withQuery(QueryBuilders.boolQuery().must(queryStringQuery(searchValue)))
        		.withSort(SortBuilders.fieldSort("name"))
        		.withPageable(pageable);
    	return eventSearchRepo.search(nqb.build());
    }
    
    @Override
    public Page<EventEdition> findEventEditions(Long idEvent, Pageable pageable) {
    	Page<EventEdition> result = eventEditionRepository.findByEventIdOrderByEditionYearDesc(idEvent, pageable);
    	return result;
    }

	@Override
	@Transactional(readOnly=true)
	public List<EventEditionIdYearDTO> findEventEditionsIdYear(Long idEvent) {
		return eventEditionRepository.findEventEditionsIdYear(idEvent)
				.stream()
				.map(e -> new EventEditionIdYearDTO((Long)e[0], (Integer)e[1]))
				.collect(Collectors.<EventEditionIdYearDTO> toList());
	}
}
