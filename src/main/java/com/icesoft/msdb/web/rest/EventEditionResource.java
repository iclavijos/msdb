package com.icesoft.msdb.web.rest;

import com.fasterxml.jackson.annotation.JsonView;
import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.domain.enums.SessionType;
import com.icesoft.msdb.repository.jpa.*;
import com.icesoft.msdb.repository.search.EventEditionSearchRepository;
import com.icesoft.msdb.repository.search.EventEntrySearchRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.*;
import com.icesoft.msdb.service.dto.ParticipantPointsDTO;
import com.icesoft.msdb.service.dto.EventsSeriesNavigationDTO;
import com.icesoft.msdb.service.dto.SessionCalendarDTO;
import com.icesoft.msdb.service.dto.SessionResultDTO;
import com.icesoft.msdb.service.impl.CacheHandler;
import com.icesoft.msdb.service.impl.ResultsService;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;

import com.icesoft.msdb.web.rest.views.ResponseViews;
import lombok.RequiredArgsConstructor;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * REST controller for managing {@link com.icesoft.msdb.domain.EventEdition}.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Transactional
public class EventEditionResource {

    private final Logger log = LoggerFactory.getLogger(EventEditionResource.class);

    private static final String ENTITY_NAME = "eventEdition";
    private static final String ENTITY_NAME_SESSION = "eventSession";
    private static final String ENTITY_NAME_ENTRY = "eventEntry";
    private static final String ENTITY_NAME_RESULT = "eventEntryResult";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventEditionRepository eventEditionRepository;
    private final EventEditionSearchRepository eventEditionSearchRepo;
    private final EventSessionRepository eventSessionRepository;
    private final EventEntryRepository eventEntryRepository;
    private final DriverEntryRepository driverEntryRepository;
    private final EventEntrySearchRepository eventEntrySearchRepo;
    private final EventEntryResultRepository eventResultRepository;
    private final ResultsService resultsService;
    private final StatisticsService statsService;
    private final CDNService cdnService;
    private final CacheHandler cacheHandler;
    private final EventService eventService;
    private final SeriesEditionService seriesEditionService;
    private final SubscriptionsService subscriptionsService;
    private final SearchService searchService;

    /**
     * {@code POST  /event-editions} : Create a new eventEdition.
     *
     * @param eventEdition the eventEdition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventEdition, or with status {@code 400 (Bad Request)} if the eventEdition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-editions")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<EventEdition> createEventEdition(@Valid @RequestBody EventEdition eventEdition) throws URISyntaxException {
        log.debug("REST request to save EventEdition : {}", eventEdition);
        if (eventEdition.getId() != null) {
            throw new BadRequestAlertException("A new eventEdition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventEdition result = eventService.save(eventEdition);

        return ResponseEntity
            .created(new URI("/api/event-editions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-editions/:id} : Updates an existing eventEdition.
     *
     * @param id the id of the eventEdition to save.
     * @param eventEdition the eventEdition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventEdition,
     * or with status {@code 400 (Bad Request)} if the eventEdition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventEdition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-editions/{id}")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @Transactional
    public ResponseEntity<EventEdition> updateEventEdition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EventEdition eventEdition
    ) throws URISyntaxException {
        log.debug("REST request to update EventEdition : {}, {}", id, eventEdition);
        if (eventEdition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventEdition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventEditionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EventEdition result = eventEditionRepository.findById(eventEdition.getId()).get();
        if (result.getSeriesEditions() != null) {
    		eventEdition.setSeriesEditions(result.getSeriesEditions());
    	}

        if (eventEdition.getPoster() != null || result.getPosterUrl() != null) {
            eventEdition.setId(result.getId());
            eventEdition.setPosterUrl(updateImage(
                eventEdition.getPoster(),
                eventEdition.getPosterUrl(),
                result.getId().toString(),
                "affiche"
            ));
            result = eventEditionRepository.save(result);
        }
        result = eventService.save(eventEdition, true);

//        eventEditionSearchRepo.deleteById(result.getId()); //TODO: Temporary fix to avoid duplicity after cloning series edition
//        eventEditionSearchRepo.save(result);

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventEdition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /event-editions/:id} : Partial updates given fields of an existing eventEdition, field will ignore if it is null
     *
     * @param id the id of the eventEdition to save.
     * @param eventEdition the eventEdition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventEdition,
     * or with status {@code 400 (Bad Request)} if the eventEdition is not valid,
     * or with status {@code 404 (Not Found)} if the eventEdition is not found,
     * or with status {@code 500 (Internal Server Error)} if the eventEdition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/event-editions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EventEdition> partialUpdateEventEdition(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EventEdition eventEdition
    ) throws URISyntaxException {
        log.debug("REST request to partial update EventEdition partially : {}, {}", id, eventEdition);
        if (eventEdition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventEdition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventEditionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EventEdition> result = eventEditionRepository
            .findById(eventEdition.getId())
            .map(existingEventEdition -> {
                if (eventEdition.getEditionYear() != null) {
                    existingEventEdition.setEditionYear(eventEdition.getEditionYear());
                }
                if (eventEdition.getShortEventName() != null) {
                    existingEventEdition.setShortEventName(eventEdition.getShortEventName());
                }
                if (eventEdition.getLongEventName() != null) {
                    existingEventEdition.setLongEventName(eventEdition.getLongEventName());
                }
                if (eventEdition.getEventDate() != null) {
                    existingEventEdition.setEventDate(eventEdition.getEventDate());
                }

                return existingEventEdition;
            })
            .map(eventEditionRepository::save)
            .map(savedEventEdition -> {
                eventEditionSearchRepo.save(savedEventEdition);

                return savedEventEdition;
            });

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventEdition.getId().toString())
        );
    }

    /**
     * {@code GET  /event-editions} : get all the eventEditions.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventEditions in body.
     */
    @GetMapping("/event-editions")
    public ResponseEntity<List<EventEdition>> getAllEventEditions(Pageable pageable) {
        log.debug("REST request to get a page of EventEditions");
        Page<EventEdition> page = eventEditionRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /event-editions/:id} : get the "id" eventEdition.
     *
     * @param id the id of the eventEdition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventEdition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-editions/{id}")
    public ResponseEntity<EventEdition> getEventEdition(@PathVariable Long id) {
        log.debug("REST request to get EventEdition : {}", id);
        Optional<EventEdition> eventEditionOpt = eventEditionRepository.findById(id);
        if (eventEditionOpt.isPresent()) {
            EventEdition eventEdition = eventEditionOpt.get();
        	List<Long> tmp = eventEditionRepository.findNextEditionId(eventEdition.getEvent().getId(), eventEdition.getEditionYear());
        	if (tmp != null && !tmp.isEmpty()) {
        		eventEdition.setNextEditionId(tmp.get(0));
        	}
        	tmp = eventEditionRepository.findPreviousEditionId(eventEdition.getEvent().getId(), eventEdition.getEditionYear());
        	if (tmp != null && !tmp.isEmpty()) {
        		eventEdition.setPreviousEditionId(tmp.get(0));
        	}

        }
        return ResponseUtil.wrapOrNotFound(eventEditionOpt);
    }

    /**
     * {@code DELETE  /event-editions/:id} : delete the "id" eventEdition.
     *
     * @param id the id of the eventEdition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-editions/{id}")
    @Secured({AuthoritiesConstants.ADMIN})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    @Transactional
    public ResponseEntity<Void> deleteEventEdition(@PathVariable Long id) {
        log.debug("REST request to delete EventEdition : {}", id);
        EventEdition eventEd = eventEditionRepository.findById(id).get();

        if (eventEd.getSeriesEditions() != null) {
            eventEd.getSeriesEditions().stream().forEach(se -> {
                seriesEditionService.removeEventFromSeries(se.getId(), id);
                cacheHandler.resetWinnersCache(se.getId());
            });
        }

        List<EventSession> sessions = eventSessionRepository.findByEventEditionIdOrderBySessionStartTimeAsc(id);
        sessions.forEach(eventSession -> {
            eventResultRepository.deleteBySession(eventSession);
        });
        eventSessionRepository.deleteAllInBatch(sessions);
        eventEntryRepository.deleteByEventEdition(eventEd);

        if (eventEd.getPosterUrl() != null) {
            cdnService.deleteImage(id.toString(), "affiche");
        }

        eventEditionRepository.deleteById(id);
        eventEditionSearchRepo.deleteById(id);

        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/event-editions/{id}/prevNextInSeries")
    @Transactional(readOnly=true)
    public List<EventsSeriesNavigationDTO> getPrevNextIdInSeries(@PathVariable Long id) {
    	EventEdition event = eventEditionRepository.findById(id).orElseThrow(
            () -> new MSDBException("Invalid event edition id " + id)
        );
    	List<EventsSeriesNavigationDTO> result = new ArrayList<>();
    	for(SeriesEdition se: event.getSeriesEditions()) {
    		List<EventEdition> events = se.getEvents().parallelStream().sorted(Comparator.comparing(EventEdition::getEventDate))
                .collect(Collectors.toList());
    		int index = events.indexOf(event);
    		EventEdition next = (index < se.getEvents().size() - 1) ? events.get(index + 1) : null;
            EventEdition prev = (index > 0) ? events.get(index - 1) : null;
            result.add(new EventsSeriesNavigationDTO(
            		Optional.ofNullable(prev).map(ee -> ee.getId()).orElse(null),
            		Optional.ofNullable(next).map(ee -> ee.getId()).orElse(null),
            		Optional.ofNullable(prev).map(ee -> ee.getLongEventName()).orElse(null),
            		Optional.ofNullable(next).map(ee -> ee.getLongEventName()).orElse(null)));
    	}

    	return result;
    }

    /**
     * {@code SEARCH  /_search/event-editions?query=:query} : search for the eventEdition corresponding
     * to the query.
     *
     * @param query the query of the eventEdition search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/event-editions")
    public ResponseEntity<List<EventEdition>> searchEventEditions(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of EventEditions for query {}", query);

        Page<EventEdition> page = searchService.performWildcardSearch(
            EventEdition.class,
            query,
            Arrays.asList("longEventName", "shortEventName"),
            pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/event-editions/{id}/sessions")
    @Transactional(readOnly = true)
    public List<EventSession> getEventEditionSessions(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "false") Boolean nonFP) {
    	log.debug("REST request to get all EventEditions {} sessions", id);
        List<EventSession> result;
        if (nonFP) {
            result = eventSessionRepository.findNonFPSessions(id);
        } else {
            result = eventSessionRepository.findByEventEditionIdOrderBySessionStartTimeAsc(id);
        }
        result.parallelStream().forEach(session -> session.setEventEdition(null));
    	return result;
    }

//    @GetMapping("/event-editions/{id}/sessions/nonfp")
//    public List<EventSession> getEventEditionNonFPSessions(@PathVariable Long id) {
//    	log.debug("REST request to get all EventEditions {} sessions", id);
//    	List<EventSession> result = eventSessionRepository.findNonFPSessions(id);
//    	result.parallelStream().forEach(session -> session.setEventEdition(null));
//    	return result;
//    }

    @PostMapping("/event-editions/event-sessions")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="calendar", allEntries=true)
    @Transactional
    public ResponseEntity<EventSession> createEventEditionSession(@Valid @RequestBody EventSession eventSession) throws URISyntaxException {
        log.debug("REST request to save EventSession : {}", eventSession);
        if (eventSession.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(
            		applicationName, true, ENTITY_NAME_SESSION, "idexists", "A new eventSession cannot already have an ID")).body(null);
        }
        eventSession.setEventEdition(eventEditionRepository.findById(eventSession.getEventEdition().getId()).orElseThrow(
            () -> new MSDBException("Invalid event edition id " + eventSession.getEventEdition().getId())
        ));

        eventSession.setSessionStartTime(resetSessionStartTimeSeconds(eventSession.getSessionStartTimeDate()).toInstant());
        EventSession result = eventSessionRepository.save(eventSession);
        subscriptionsService.saveEventSession(result);
        return ResponseEntity.created(new URI("/api/event-editions/" + result.getId() +"/sessions"))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME_SESSION, result.getId().toString()))
            .body(result);
    }

    @GetMapping("/event-editions/event-sessions/{id}")
    public ResponseEntity<EventSession> getEventSession(@PathVariable Long id) {
        log.debug("REST request to get EventSession : {}", id);
        Optional<EventSession> eventSession = eventSessionRepository.findById(id);

        return ResponseUtil.wrapOrNotFound(eventSession);
    }

    @DeleteMapping("/event-editions/event-sessions/{id}")
    @Secured({AuthoritiesConstants.ADMIN})
    @CacheEvict(cacheNames="calendar", allEntries=true)
    @Transactional
    public ResponseEntity<Void> deleteEventSession(@PathVariable Long id) {
        log.debug("REST request to delete EventSession : {}", id);
        eventSessionRepository.findById(id).ifPresent(session -> {
            subscriptionsService.deleteEventSession(session);
            eventSessionRepository.delete(session);
        });
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    @PutMapping("/event-editions/event-sessions/{id}")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="calendar", allEntries=true)
    @Transactional
    public ResponseEntity<EventSession> updateEventSession(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EventSession eventSession) throws URISyntaxException {
        log.debug("REST request to update EventSession : {}, {}", id, eventSession);
        if (eventSession.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventSession.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!eventSessionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        eventSession.setSessionStartTime(resetSessionStartTimeSeconds(eventSession.getSessionStartTimeDate()).toInstant());
        eventSession.setEventEdition(eventEditionRepository.findById(eventSession.getEventEdition().getId()).orElseThrow(
            () -> new MSDBException("Invalid event edition id " + eventSession.getEventEdition().getId())
        ));

        if (eventSession.getId() == null) {
            return createEventEditionSession(eventSession);
        }
        Long prevSessionStartTime = eventSessionRepository.findById(eventSession.getId())
            .orElseThrow(() -> new MSDBException("Invalid session id " + eventSession.getId())).getSessionStartTime().getEpochSecond();

        EventSession result = eventSessionRepository.save(eventSession);
        if (result.getSessionStartTime().equals(prevSessionStartTime)) {
            subscriptionsService.saveEventSession(result);
        } else {
            subscriptionsService.saveEventSession(result, prevSessionStartTime);
        }

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    private ZonedDateTime resetSessionStartTimeSeconds(ZonedDateTime eventSessionStartTime) {
        // Ensuring start time is set to zero seconds
        return eventSessionStartTime.truncatedTo(ChronoUnit.MINUTES);
    }

    @PutMapping("/event-editions/event-sessions/{sessionId}/process-results")
    @CacheEvict(cacheNames = {"driversStandingsCache", "teamsStandingsCache", "pointRaceByRace", "winnersCache", "resultsRaceByRace"}) //TODO: Improve to only remove the required key
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @Transactional
    public ResponseEntity<Void> processSessionResults(@PathVariable Long sessionId) {
    	log.debug("Processing results of session {}", sessionId);
    	EventSession session = eventSessionRepository.findById(sessionId).orElseThrow(
            () -> new MSDBException("Invalid event session id " + sessionId)
        );
    	session.getEventEdition().getSeriesEditions().forEach(seriesEdition -> cacheHandler.resetSeriesEditionCaches(seriesEdition));
    	resultsService.processSessionResults(sessionId);
    	if (session.getSessionType().equals(SessionType.RACE)) {
			log.info("Updating statistics...", session.getEventEdition().getLongEventName(), session.getName());
			statsService.removeEventStatistics(session.getEventEdition());
			statsService.buildEventStatistics(session.getEventEdition());
			log.info("Statistics updated");
		}
    	return ResponseEntity.ok().build();
    }

    @GetMapping("/event-editions/{id}/entries")
    public List<EventEditionEntry> getEventEditionEntries(@PathVariable Long id) {
    	log.debug("REST request to get all EventEditions {} entries", id);
    	List<EventEditionEntry> result = eventEntryRepository.findEventEditionEntries(id);
    	result.parallelStream().forEach(entry -> {
    		EventEdition tmp = new EventEdition();
    		tmp.setId(entry.getEventEdition().getId());
    		tmp.setMultidriver(entry.getEventEdition().isMultidriver());
    		entry.setEventEdition(tmp);
    	});
    	return result;
    }

    @GetMapping("/event-editions/{eventId}/points/drivers/{driverId}")
    @Transactional(readOnly = true)
    @JsonView(ResponseViews.ParticipantPointsDetailView.class)
    public ResponseEntity<List<ParticipantPointsDTO>> getDriverEventPoints(@PathVariable Long eventId, @PathVariable Long driverId) {
    	List<ParticipantPointsDTO> result = resultsService.getDriverPointsEvent(eventId, driverId);

    	return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/event-editions/{eventId}/points/drivers")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ParticipantPointsDTO>> getDriversEventPoints(@PathVariable Long eventId) {
    	List<ParticipantPointsDTO> result = resultsService.getDriversPointsEvent(eventId);

    	return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/event-editions/{seriesId}/{eventId}/points/drivers")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ParticipantPointsDTO>> getDriversEventPointsInSeries(@PathVariable Long seriesId, @PathVariable Long eventId) {
    	List<ParticipantPointsDTO> result = resultsService.getDriversPointsEvent(seriesId, eventId);

    	return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/event-editions/{eventId}/points/teams/{teamId}")
    @Transactional(readOnly = true)
    @JsonView(ResponseViews.ParticipantPointsDetailView.class)
    public ResponseEntity<List<ParticipantPointsDTO>> getTeamEventPoints(@PathVariable Long eventId, @PathVariable Long teamId) {
        List<ParticipantPointsDTO> result = resultsService.getTeamPointsEvent(eventId, teamId);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/event-editions/{eventId}/points/teams")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ParticipantPointsDTO>> getTeamsEventPoints(@PathVariable Long eventId) {
        List<ParticipantPointsDTO> result = resultsService.getTeamsPointsEvent(eventId);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/event-editions/{seriesId}/{eventId}/points/teams")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ParticipantPointsDTO>> getTeamsEventPointsInSeries(@PathVariable Long seriesId, @PathVariable Long eventId) {
        List<ParticipantPointsDTO> result = resultsService.getTeamsPointsEvent(seriesId, eventId);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/event-editions/{idTarget}/entries/{idSource}")
    @Transactional
    public ResponseEntity<Void> copyEntries(@PathVariable Long idTarget, @PathVariable Long idSource) {
    	List<EventEditionEntry> entries = eventEntryRepository.findEventEditionEntries(idSource);
    	EventEdition target = eventEditionRepository.findById(idTarget).orElseThrow(
            () -> new MSDBException("Invalid event edition id " + idTarget)
        );
    	for(EventEditionEntry entry : entries) {
    		EventEditionEntry copiedEntry = EventEditionEntry.builder()
    			.category(entry.getCategory())
    			.entryName(entry.getEntryName())
    			.eventEdition(target)
    			.raceNumber(entry.getRaceNumber())
    			.chassis(entry.getChassis())
    			.engine(entry.getEngine())
    			.fuel(entry.getFuel())
    			.tyres(entry.getTyres())
    			.team(entry.getTeam())
    			.operatedBy(entry.getOperatedBy())
    			.carImageUrl(entry.getCarImageUrl())
                .build();

            copiedEntry = eventEntryRepository.save(copiedEntry);

    		Set<DriverEntry> copiedList = new HashSet<>();
    		for(DriverEntry driverEntry: entry.getDrivers()) {
    		    DriverEntry de = new DriverEntry();
    		    de.setDriver(driverEntry.getDriver());
    		    de.setEventEntry(copiedEntry);
    		    de.setCategory(driverEntry.getCategory());
    		    de.setRookie(driverEntry.getRookie());
    			copiedList.add(de);
    		}
    		copiedEntry.drivers(copiedList);

            driverEntryRepository.saveAll(copiedList);
    	}
    	return ResponseEntity.ok().headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, idTarget.toString())).build();
    }

    @PostMapping("/event-editions/{eventEditionId}/entries")

    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<EventEditionEntry> createEventEditionEntry(
        @Valid @RequestBody EventEditionEntry eventEntry, @PathVariable Long eventEditionId) throws URISyntaxException {
        log.debug("REST request to save EventEntry : {}", eventEntry);
        if (eventEntry.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(
            		applicationName, true, ENTITY_NAME_ENTRY, "idexists", "A new eventEntry cannot already have an ID")).body(null);
        }

        EventEdition eventEdition = eventEditionRepository.findById(eventEditionId).orElseThrow(
            () -> new MSDBException("Invalid event edition id")
        );
        eventEntry.setEventEdition(eventEdition);
        EventEditionEntry result = eventEntryRepository.save(eventEntry);
        eventEntry.getDrivers().forEach(de -> de.setEventEntry(result));
        driverEntryRepository.saveAll(eventEntry.getDrivers());
        if (result.getCarImage() != null) {
	        String cdnUrl = cdnService.uploadImage(result.getId().toString(), result.getCarImage(), ENTITY_NAME_ENTRY);
			result.setCarImageUrl(cdnUrl);

			eventEntryRepository.save(result);
        }
        // Temporarily removing persistence of event entries on search engine
        // eventEntrySearchRepo.save(result);
        return ResponseEntity.created(new URI("/api/event-editions/" + result.getId() +"/entries"))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME_ENTRY, result.getId().toString()))
            .body(result);
    }

    @PutMapping("/event-editions/{eventEditionId}/entries")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<EventEditionEntry> updateEventEditionEntry(
        @Valid @RequestBody EventEditionEntry eventEntry, @PathVariable Long eventEditionId) throws URISyntaxException {
        log.debug("REST request to update EventEntry : {}", eventEntry);
        if (eventEntry.getId() == null) {
            return createEventEditionEntry(eventEntry, eventEditionId);
        }
        EventEdition eventEdition = eventEditionRepository.findById(eventEditionId).orElseThrow(
            () -> new MSDBException("Invalid event edition id")
        );
        eventEntry.setEventEdition(eventEdition);
        if (eventEntry.getCarImage() != null) {
	        String cdnUrl = cdnService.uploadImage(eventEntry.getId().toString(), eventEntry.getCarImage(), ENTITY_NAME_ENTRY);
	        eventEntry.setCarImageUrl(cdnUrl);
        }
        driverEntryRepository.deleteByEventEntry(eventEntry);
        eventEntry.getDrivers().forEach(de -> de.setEventEntry(eventEntry));
        driverEntryRepository.saveAll(eventEntry.getDrivers());
        EventEditionEntry result = eventEntryRepository.save(eventEntry);

        // Temporarily removing persistence of event entries on search engine
        // eventEntrySearchRepo.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME_ENTRY, eventEntry.getId().toString()))
            .body(result);
    }

    @GetMapping("/event-editions/entries/{id}")
    public ResponseEntity<EventEditionEntry> getEventEntry(@PathVariable Long id) {
        log.debug("REST request to get EventEntry : {}", id);
        EventEditionEntry eventEntry = eventEntryRepository.findById(id).orElseThrow(
            () -> new MSDBException("Invalid event edition entry id " + id)
        );
        EventEdition tmp = new EventEdition();
        tmp.setId(eventEntry.getEventEdition().getId());
        tmp.setMultidriver(eventEntry.getEventEdition().isMultidriver());
        eventEntry.setEventEdition(tmp);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eventEntry));
    }

    @DeleteMapping("/event-editions/entries/{id}")
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteEventEntry(@PathVariable Long id) {
        log.debug("REST request to delete EventEntry : {}", id);
        eventEntryRepository.findById(id).orElseThrow(
            () -> new MSDBException("Invalid entry id provided: " + id)
        );
        eventResultRepository.deleteByEntryId(id);
        driverEntryRepository.deleteByIdEntryId(id);
        eventEntryRepository.deleteById(id);
        eventEntrySearchRepo.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil
            .createEntityDeletionAlert(applicationName, false, ENTITY_NAME_ENTRY, id.toString())).build();
    }

    @GetMapping("/event-editions/{id}/event-sessions/{idSession}/results")
    @Transactional(readOnly = true)
    public List<SessionResultDTO> getEventSessionResults(@PathVariable Long id, @PathVariable Long idSession) {
    	log.debug("REST request to get EventEdition {} results for session {}", id, idSession);
    	List<EventEntryResult> result = eventResultRepository.findBySessionIdOrderByFinalPositionAsc(idSession);

    	return result.parallelStream()
    			.sorted((r1, r2) -> {
    				if (r1.getFinalPosition() < 800 && r2.getFinalPosition() < 800) {
    					return r1.getFinalPosition().compareTo(r2.getFinalPosition());
    				} else if (r1.getFinalPosition() >= 800 && r2.getFinalPosition() >= 800) {
    				    //Both cars DNFed
                        if (r1.getFinalPosition().equals(r2.getFinalPosition())) {
                            if (r2.getLapsCompleted() == null || r1.getLapsCompleted() == null) {
                                return r2.getFinalPosition().compareTo(r1.getFinalPosition()) * -1;
                            } else return r2.getLapsCompleted().compareTo(r1.getLapsCompleted());
                        } else {
                            return r1.getFinalPosition().compareTo(r2.getFinalPosition());
                        }
    				} else if (r1.getFinalPosition() < 800) {
    					return -1;
    				} else {
    					return 1;
    				}
    			})
    			.map(r -> new SessionResultDTO(r)).collect(Collectors.toList());
    }

    @GetMapping("/event-editions/event-sessions/{idSession}/fastestLap")
    public ResponseEntity<Long> getEventSessionFastestTime(@PathVariable Long idSession) {
        Long bestLap = eventResultRepository.findSessionFastestTime(idSession);
        return ResponseEntity.ok(bestLap);
    }

    @GetMapping("/event-editions/event-sessions/{idSession}/maxLaps")
    public ResponseEntity<Integer> getEventSessionMaxLapsCompleted(@PathVariable Long idSession) {
        Integer maxLaps = eventResultRepository.findSessionMaxLapsCompleted(idSession);
        return ResponseEntity.ok(maxLaps);
    }

    @GetMapping("/event-editions/event-sessions/results/{idResult}")
    @Transactional(readOnly = true)
    public ResponseEntity<EventEntryResult> getEventSessionResult(@PathVariable Long idResult) {
        log.debug("REST request to get eventSessionResult : {}", idResult);
        EventEntryResult eventEntryResult = eventResultRepository.findById(idResult).orElseThrow(
            () -> new MSDBException("Invalid event entry result id " + idResult)
        );
        if (eventEntryResult.getEntry().getEventEdition() != null &&
        		eventEntryResult.getEntry().getEventEdition().getSeriesEditions() != null) {
        	eventEntryResult.getEntry().getEventEdition().getSeriesEditions().stream().forEach(sEd -> {
        		SeriesEdition tmp = new SeriesEdition();
        		tmp.setId(sEd.getId());
        		tmp.setEditionName(sEd.getEditionName());
        		Series tmpSeries = new Series();
        		tmpSeries.setId(sEd.getSeries().getId());
        		tmpSeries.setName(sEd.getSeries().getName());
        		tmp.setSeries(tmpSeries);
    			//eventEntryResult.getEntry().getEventEdition().setSeriesEdition(tmp);
        	});

        }
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eventEntryResult));
    }

    @GetMapping("/event-editions/calendar/{startDate}/{endDate}")
    public List<SessionCalendarDTO> getEvents(@PathVariable LocalDate startDate, @PathVariable LocalDate endDate) {
    	LocalDateTime startMidnight = LocalDateTime.of(startDate, LocalTime.MIDNIGHT);
		ZonedDateTime start = ZonedDateTime.of(startMidnight, ZoneId.of("UTC"));
		ZonedDateTime end = ZonedDateTime.of(endDate.atTime(23, 59, 59), ZoneId.of("UTC"));
    	List<EventSession> tmp = eventSessionRepository.findUpcomingSessions(start.toInstant(), end.toInstant());
    	return tmp.parallelStream().map(session -> {
    		String[] logoUrl = null;
            Integer seriesRelevance = null;
            String seriesName = null;
    		if (session.getEventEdition().getSeriesEditions() != null) {
                Optional<String> seriesLogo = Optional.ofNullable(session.getEventEdition().getSeriesEditions().stream()
                    .map(series -> Optional.ofNullable(series.getLogoUrl()).orElse(
                        series.getSeries().getLogoUrl()
                    )).findFirst().orElse(null));
                logoUrl = new String[] {seriesLogo.orElse(
                    Optional.ofNullable(session.getEventEdition().getPosterUrl()).orElse(null))};
                if (isSpecialEvent(session.getEventEdition().getEvent())) {
                    seriesRelevance = 1;
                } else {
                    seriesRelevance = session.getEventEdition().getSeriesEditions().stream()
                        .map(sEd -> sEd.getSeries().getRelevance())
                        .max(Integer::compareTo).orElse(700);
                }
    			seriesName = session.getEventEdition().getSeriesEditions().parallelStream()
                        .map(sEd -> sEd.getSeries().getName())
                        .findFirst().orElse(null);
    		}

    		return new SessionCalendarDTO(session.getEventEdition().getId(),
                    session.getEventEdition().getEvent().getId(),
    				seriesName,
    				session.getEventEdition().getLongEventName(),
    				session.getSessionType().equals(SessionType.STAGE)
                        ? String.format("%s - %s", session.getShortname(), session.getName())
                        : session.getName(),
                    session.getCancelled(),
    				session.getSessionType(),
    				session.getSessionStartTimeDate(), session.getSessionEndTime(),
                    session.getDuration(),
                    session.getTotalDuration(),
    				session.getEventEdition().getStatus().getCode(),
                    seriesRelevance,
    				Optional.ofNullable(session.getEventEdition().getTrackLayout())
                        .map(racetrackLayout -> racetrackLayout.getRacetrack().getName())
                        .orElse(session.getEventEdition().getLocation()),
                    Optional.ofNullable(session.getEventEdition().getTrackLayout())
                        .map(racetrackLayout -> racetrackLayout.getLayoutImageUrl())
                        .orElse(null),
                    session.getEventEdition().getAllowedCategories().stream()
                        .map(category -> category.getShortname()).toArray(String[]::new),
                    session.getEventEdition().getEvent().isRally(),
                    session.getEventEdition().getEvent().isRaid(),
    				logoUrl);
    	})
            .sorted(Comparator.comparing(SessionCalendarDTO::getSeriesRelevance))
            .collect(Collectors.toList());
    }

    @PostMapping("/event-editions/event-sessions/{sessionId}/results")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    //@CacheEvict(cacheNames={"winnersCache", "pointRaceByRace", "resultsRaceByRace"}, allEntries = true)
    public ResponseEntity<EventEntryResult> createEventSessionResult(
            @Valid @RequestBody EventEntryResult eventSessionResult, @PathVariable Long sessionId) throws URISyntaxException {

        log.debug("REST request to save EventEntryResult : {}", eventSessionResult);
        EventSession session = eventSessionRepository.findById(sessionId).orElseThrow(
            () -> new MSDBException("Invalid session id") );
        eventSessionResult.setSession(session);
        session.getEventEdition().getSeriesEditions().forEach(seriesEdition -> cacheHandler.resetSeriesEditionCaches(seriesEdition));
        if (eventSessionResult.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(
            		applicationName, true, ENTITY_NAME_ENTRY, "idexists", "A new eventSessionResult cannot already have an ID")).body(null);
        }
        EventEntryResult result = eventResultRepository.save(eventSessionResult);

        return ResponseEntity.created(new URI("/api/event-editions/" + result.getId() +"/entries"))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME_RESULT, result.getId().toString()))
            .body(result);
    }

    @PutMapping("/event-editions/event-sessions/{sessionId}/results")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    //@CacheEvict(cacheNames={"winnersCache", "pointRaceByRace", "resultsRaceByRace"}, allEntries = true)
    public ResponseEntity<EventEntryResult> updateEventSessionResult(
            @Valid @RequestBody EventEntryResult eventSessionResult, @PathVariable Long sessionId) throws URISyntaxException {
        log.debug("REST request to update EventEntryResult : {}", eventSessionResult);

        if (eventSessionResult.getId() == null) {
            return createEventSessionResult(eventSessionResult, sessionId);
        }
        EventSession session = eventSessionRepository.findById(sessionId).orElseThrow(
            () -> new MSDBException("Invalid session id") );
        eventSessionResult.setSession(session);
        eventSessionResult.getSession().getEventEdition().getSeriesEditions().forEach(seriesEdition -> cacheHandler.resetSeriesEditionCaches(seriesEdition));
        EventEntryResult result = eventResultRepository.save(eventSessionResult);

        return ResponseEntity.ok()
            .headers(HeaderUtil
                .createEntityUpdateAlert(applicationName, false, ENTITY_NAME_RESULT, eventSessionResult.getId().toString()))
            .body(result);
    }

    @DeleteMapping("/event-editions/event-sessions/results/{id}")
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteEventSessionResult(@PathVariable Long id) {
        log.debug("REST request to delete EventSessionResult : {}", id);
        eventResultRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil
            .createEntityDeletionAlert(applicationName, false, ENTITY_NAME_RESULT, id.toString())).build();
    }

    @GetMapping("/event-editions/{id}/bestTimes")
    public ResponseEntity<String[][]> getDriversBestTimes(@PathVariable Long id) {
    	log.debug("REST request to retrieve drivers best times on event {}", id);
    	return ResponseEntity.ok(resultsService.getDriverEventBestTimes(id));
    }

    @PutMapping("/event-editions/{id}/reschedule")
    public ResponseEntity<EventEdition> rescheduleEvent(@PathVariable Long id, @Valid @RequestBody LocalDate newDate) {
        EventEdition event = eventEditionRepository.findById(id)
            .orElseThrow(() -> new MSDBException("Invalid event edition id"));
        event = eventService.rescheduleEvent(event, newDate);
        return ResponseEntity.ok()
            .headers(HeaderUtil
                .createEntityUpdateAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .body(event);
    }

    @PostMapping("/event-editions/{eventEditionId}/clone")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @Transactional
    public ResponseEntity<Void> cloneEventEdition(@PathVariable Long eventEditionId, @RequestBody String newPeriod) {
        eventService.cloneEventEdition(eventEditionId, newPeriod, Collections.<SeriesEdition>emptySet());
        return ResponseEntity.ok().headers(
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, eventEditionId.toString())).build();
    }

    private String updateImage(byte[] image, String imageUrl, String id, String folder) {
        if (image != null) {
            return cdnService.uploadImage(id, image, folder);
        } else if (imageUrl == null) {
            if (id != null) {
                cdnService.deleteImage(id, folder);
                return null;
            }
        }
        return imageUrl;
    }

    private boolean isSpecialEvent(Event event) {
        boolean isSpecial =
            event.getName().equalsIgnoreCase("Indianapolis 500") ||
            event.getName().equalsIgnoreCase("24 Hours of Le Mans") ||
            event.getName().equalsIgnoreCase("Bathurst 1000") ||
            event.getName().contains("Dakar");

        return isSpecial;
    }
}
