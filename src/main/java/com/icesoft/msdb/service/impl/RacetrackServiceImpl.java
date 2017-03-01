package com.icesoft.msdb.service.impl;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.Racetrack;
import com.icesoft.msdb.domain.RacetrackLayout;
import com.icesoft.msdb.repository.RacetrackLayoutRepository;
import com.icesoft.msdb.repository.RacetrackRepository;
import com.icesoft.msdb.repository.search.RacetrackSearchRepository;
import com.icesoft.msdb.service.RacetrackService;

/**
 * Service Implementation for managing Racetrack.
 */
@Service
@Transactional
public class RacetrackServiceImpl implements RacetrackService{

    private final Logger log = LoggerFactory.getLogger(RacetrackServiceImpl.class);
    
    private final RacetrackRepository racetrackRepository;
    
    private final RacetrackLayoutRepository racetrackLayoutRepository;

    private final RacetrackSearchRepository racetrackSearchRepository;

    public RacetrackServiceImpl(RacetrackRepository racetrackRepository, RacetrackLayoutRepository racetrackLayoutRepository,
    		RacetrackSearchRepository racetrackSearchRepository) {
        this.racetrackRepository = racetrackRepository;
        this.racetrackLayoutRepository = racetrackLayoutRepository;
        this.racetrackSearchRepository = racetrackSearchRepository;
    }

    /**
     * Save a racetrack.
     *
     * @param racetrack the entity to save
     * @return the persisted entity
     */
    @Override
    public Racetrack save(Racetrack racetrack) {
        log.debug("Request to save Racetrack : {}", racetrack);
        Racetrack result = racetrackRepository.save(racetrack);
        racetrackSearchRepository.save(result);
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
    public Page<Racetrack> findAll(Pageable pageable) {
        log.debug("Request to get all Racetracks");
        Page<Racetrack> result = racetrackRepository.findAll(pageable);
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
    public Racetrack findOne(Long id) {
        log.debug("Request to get Racetrack : {}", id);
        Racetrack racetrack = racetrackRepository.findOne(id);
        return racetrack;
    }

    /**
     *  Delete the  racetrack by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Racetrack : {}", id);
        Racetrack racetrack = racetrackRepository.findOne(id);
        racetrackLayoutRepository.delete(racetrack.getLayouts());
        racetrackRepository.delete(id);
        racetrackSearchRepository.delete(id);
    }
    
    @Override
    public List<Racetrack> search(String query) {
    	return StreamSupport
                .stream(racetrackSearchRepository.search(queryStringQuery(query)).spliterator(), false)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<RacetrackLayout> findRacetrackLayouts(Long id) {
    	return racetrackLayoutRepository.findByRacetrackIdOrderByActiveDescYearFirstUseDescNameAsc(id);
    }
}
