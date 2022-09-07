package com.icesoft.msdb.service.impl;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import com.google.maps.model.Geometry;
import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.repository.jpa.*;
import com.icesoft.msdb.service.SearchService;
import com.icesoft.msdb.service.GeoLocationService;
import com.icesoft.msdb.service.dto.EventEditionWinnersDTO;
import com.icesoft.msdb.service.dto.SessionWinnersDTO;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.repository.search.RacetrackLayoutSearchRepository;
import com.icesoft.msdb.repository.search.RacetrackSearchRepository;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.RacetrackService;

/**
 * Service Implementation for managing Racetrack.
 */
@Service
@Transactional
public class RacetrackServiceImpl implements RacetrackService {

    private final Logger log = LoggerFactory.getLogger(RacetrackServiceImpl.class);

    private final RacetrackRepository racetrackRepository;
    private final RacetrackSearchRepository racetrackSearchRepo;

    private final RacetrackLayoutRepository racetrackLayoutRepository;
    private final RacetrackLayoutSearchRepository racetrackLayoutSearchRepo;
    private final SearchService searchService;

    private final EventEditionRepository eventEditionRepository;
    private final EventSessionRepository eventSessionRepository;
    private final EventEntryResultRepository eventEntryResultRepository;

    private final CDNService cdnService;
    private final GeoLocationService geoLocationService;

    public RacetrackServiceImpl(RacetrackRepository racetrackRepository,
                                RacetrackSearchRepository racetrackSearchRepo,
                                RacetrackLayoutRepository racetrackLayoutRepository,
                                RacetrackLayoutSearchRepository racetrackLayoutSearchRepo,
                                EventEditionRepository eventEditionRepository,
                                EventSessionRepository eventSessionRepository,
                                EventEntryResultRepository eventEntryResultRepository,
                                CDNService cdnService, GeoLocationService geoLocationService, SearchService searchService) {
        this.racetrackRepository = racetrackRepository;
        this.racetrackSearchRepo = racetrackSearchRepo;
        this.racetrackLayoutRepository = racetrackLayoutRepository;
        this.racetrackLayoutSearchRepo = racetrackLayoutSearchRepo;
        this.eventEditionRepository = eventEditionRepository;
        this.eventSessionRepository = eventSessionRepository;
        this.eventEntryResultRepository = eventEntryResultRepository;
        this.cdnService = cdnService;
        this.geoLocationService = geoLocationService;
        this.searchService = searchService;
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

        if (racetrack.getLongitude() == null || racetrack.getLongitude() == null || racetrack.getTimeZone() == null) {
            Geometry geometry = geoLocationService.getGeolocationInformation(racetrack);
            racetrack.setLatitude(geometry.location.lat);
            racetrack.setLongitude(geometry.location.lng);
            racetrack.setTimeZone(geoLocationService.getTimeZone(geometry));
        }

        if (racetrack.getLogo() != null) {
            byte[] logo = racetrack.getLogo();
            racetrack = racetrackRepository.save(racetrack);
            String cdnUrl = cdnService.uploadImage(racetrack.getId().toString(), logo, "racetrack");
            racetrack.setLogoUrl(cdnUrl);

            racetrack = racetrackRepository.save(racetrack);
        } else if (racetrack.getLogoUrl() == null) {
            if (racetrack.getId() != null) {
                cdnService.deleteImage(racetrack.getId().toString(), "racetrack");
            }
        }
        Racetrack result = racetrackRepository.save(racetrack);
        racetrackSearchRepo.save(result);
        return result;
    }

    @Override
    public RacetrackLayout save(RacetrackLayout layout) {
        log.debug("Request to save RacetrackLayout : {}", layout);

        if (layout.getLayoutImage() != null) {
        	byte[] layoutImg = layout.getLayoutImage();
        	layout = racetrackLayoutRepository.save(layout);
	        String cdnUrl = cdnService.uploadImage(layout.getId().toString(), layoutImg, "racetrackLayout");
	        layout.setLayoutImageUrl(cdnUrl);

	        layout = racetrackLayoutRepository.save(layout);
        } else if (layout.getLayoutImageUrl() == null) {
        	if (layout.getId() != null) {
        		cdnService.deleteImage(layout.getId().toString(), "racetrackLayout");
        	}
        }
        RacetrackLayout result = racetrackLayoutRepository.save(layout);
        racetrackLayoutSearchRepo.save(result);
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
    public Page<Racetrack> findRacetracks(String query, Pageable pageable) {
        log.debug("Request to get all Racetracks");
        Page<Racetrack> page;
        if (!StringUtils.isBlank(query)) {
            page = searchService.performWildcardSearch(
                Racetrack.class,
                query.toLowerCase(),
                Arrays.asList("name", "location"),
                pageable);
        } else {
            page = racetrackRepository.findAll(pageable);
        }
        return page;
    }

    /**
     *  Get one racetrack by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Racetrack find(Long id) {
        log.debug("Request to get Racetrack : {}", id);
        return racetrackRepository.findById(id)
            .orElseThrow(() -> new MSDBException("Invalid racetrack id " + id));
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable("racetrackLayoutsCache")
    public RacetrackLayout findLayout(Long id) {
        log.debug("Request to get RacetrackLayout : {}", id);
        return racetrackLayoutRepository.findById(id)
            .orElseThrow(() -> new MSDBException("Invalid racetrack layout id " + id));
    }

    /**
     *  Delete the  racetrack by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Racetrack : {}", id);
        Racetrack racetrack = racetrackRepository.findById(id)
            .orElseThrow(() -> new MSDBException("Invalid racetrack id " + id));
        racetrackLayoutSearchRepo.deleteAll(racetrack.getLayouts());
        racetrackLayoutRepository.deleteAllInBatch(racetrack.getLayouts());
        racetrackRepository.deleteById(id);
        racetrackSearchRepo.deleteById(id);
        cdnService.deleteImage(id.toString(), "racetrack");
    }

    @Override
    public void deleteLayout(Long id) {
        log.debug("Request to delete RacetrackLayout : {}", id);
        racetrackLayoutRepository.deleteById(id);
        racetrackLayoutSearchRepo.deleteById(id);
    }

    @Override
    public Page<Racetrack> search(String query, Pageable pageable) {
    	return searchService.performWildcardSearch(
            Racetrack.class,
            query.toLowerCase(),
            Arrays.asList("name", "location"),
            pageable);
    }

    @Override
    public Page<RacetrackLayout> searchLayouts(String query, Pageable pageable) {
    	return searchService.performWildcardSearch(
            RacetrackLayout.class,
            query.toLowerCase(),
            Arrays.asList("racetrack.name", "name", "racetrack.location"),
            pageable,
            1.5f, 1.0f, 1.0f);
    }

    @Override
    public List<RacetrackLayout> findRacetrackLayouts(Long id) {
    	return racetrackLayoutRepository.findByRacetrackIdOrderByActiveDescYearFirstUseDescNameAsc(id);
    }

    @Override
    public List<EventEdition> findNextEvents(Long id) {
        LocalDate today = LocalDate.now().plusDays(1);
        LocalDate plusOneYear = today.plusYears(1);

        return eventEditionRepository.findEventsAtRacetrack(id, today, plusOneYear);
    }

    @Override
    public Page<EventEditionWinnersDTO> findPreviousEvents(Long id, Pageable pageable) {
        LocalDate today = LocalDate.now();

        Page<EventEdition> events = eventEditionRepository.findPreviousEventsAtRacetrack(id, today, pageable);
        List<EventEditionWinnersDTO> eventsWinners = events.stream()
            .map(event -> {
                EventEditionWinnersDTO eventWinners = new EventEditionWinnersDTO(event);
                eventSessionRepository.findRacesInEvent(event).stream().forEach(eventSession -> {
                    List<EventEntryResult> results = eventEntryResultRepository.findBySessionIdOrderByFinalPositionAsc(eventSession.getId());
                    SessionWinnersDTO winnersDTO = new SessionWinnersDTO(eventSession.getName());
                    if (results.size() > 0) {
                        Map<Category, List<EventEntryResult>> resultsPerCategory = results.stream()
                            .collect(Collectors.groupingBy(result -> result.getEntry().getCategory()));

                        resultsPerCategory.keySet().stream()
                            .map(cat -> resultsPerCategory.get(cat).stream()
                                .sorted(Comparator.comparing(EventEntryResult::getFinalPosition))
                                .findFirst().get()
                            ).sorted(Comparator.comparing(EventEntryResult::getFinalPosition))
                            .forEach(result -> winnersDTO.addWinners(result.getEntry().getCategory().getShortname(), result.getEntry()));
                    }
                    eventWinners.addSessionWinners(winnersDTO);
                });
                return eventWinners;
            })
            .collect(Collectors.toList());

        return new PageImpl<>(eventsWinners, pageable, events.getTotalElements());
    }
}
