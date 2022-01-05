package com.icesoft.msdb.web.rest;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.domain.enums.DurationType;
import com.icesoft.msdb.domain.enums.SessionType;
import com.icesoft.msdb.domain.serializer.ParseDeserializer;
import com.icesoft.msdb.repository.*;
import com.icesoft.msdb.repository.search.*;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.dto.EnginesImportDTO;
import com.icesoft.msdb.service.dto.EventEditionImportDTO;
import com.icesoft.msdb.service.dto.RacetrackWithLayoutsImportDTO;
import com.icesoft.msdb.service.dto.SessionResultDTO;
import com.icesoft.msdb.service.impl.CacheHandler;
import io.micrometer.core.annotation.Timed;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.xml.bind.DatatypeConverter;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.SortedSet;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * REST controller for managing CSV imports
 */
@RestController
@RequestMapping("/api")
public class ImportsResource {

    private final Logger log = LoggerFactory.getLogger(ImportsResource.class);

    @Autowired private DriverRepository driversRepository;
    @Autowired private DriverSearchRepository driverSearchRepo;
    @Autowired private RacetrackRepository racetrackRepository;
    @Autowired private RacetrackLayoutRepository racetrackLayoutRepository;
    @Autowired private RacetrackSearchRepository racetrackSearchRepo;
    @Autowired private RacetrackLayoutSearchRepository racetrackLayoutSearchRepo;
    @Autowired private TeamRepository teamRepository;
    @Autowired private TeamSearchRepository teamSearchRepo;
    @Autowired private EngineRepository engineRepository;
    @Autowired private EngineSearchRepository engineSearchRepo;
    @Autowired private EventEntryRepository entryRepository;
    @Autowired private EventSessionRepository sessionRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private EventEditionRepository eventEditionRepository;
    @Autowired private EventEditionSearchRepository eventEditionSearchRepo;
    @Autowired private EventSessionRepository eventSessionRepository;
    @Autowired private EventEntryResultRepository resultRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SeriesEditionRepository seriesEditionRepository;
    @Autowired private PointsSystemRepository pointsSystemRepository;

    @Autowired private SessionLapDataRepository sessionLapDataRepo;

    @Autowired private CacheHandler cacheHandler;

    @PostMapping("/imports")
    @Timed
    @Transactional
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict("homeInfo")
    public ResponseEntity<?> importCSV(@Valid @RequestBody Imports imports) throws URISyntaxException {
        log.debug("REST request to import CSV contents : {}", imports.getImportType());

        String data = new String(DatatypeConverter.parseBase64Binary(imports.getCsvContents()));
        switch(imports.getImportType()) {
        	case DRIVERS: importDrivers(data); break;
        	case RACETRACKS: importRacetracks(data); break;
        	case TEAMS: importTeams(data); break;
        	case ENGINES: importEngines(data); break;
        	case SESSION_RESULTS: importResults(imports.getAssociatedId(), data); break;
        	case LAP_BY_LAP: importLapByLap(imports.getAssociatedId(), data); break;
        	case EVENTS: importEvents(data); break;
        	default: log.warn("The uploaded file does not correspond to any known entity");
        }
        return ResponseEntity.created(new URI("/")).build();
        // return new ResponseEntity<>("File uploaded", HttpStatus.ACCEPTED);
    }

    private <T> MappingIterator<T> initializeIterator(Class<T> type, String data) {
        return initializeIterator(type, data, false);
    }

    private <T> MappingIterator<T> initializeIterator(Class<T> type, String data, boolean ignoreUnknownFields) {
    	CsvSchema bootstrapSchema = CsvSchema.emptySchema().withHeader().withColumnSeparator(';');

        CsvMapper mapper = new CsvMapper();
        try {
        	JavaTimeModule javaTimeModule=new JavaTimeModule();
            javaTimeModule.addDeserializer(LocalDate.class, new ParseDeserializer());
            mapper.registerModule(javaTimeModule);
            if (ignoreUnknownFields) {
                mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
                // mapper.enable(JsonGenerator.Feature.IGNORE_UNKNOWN);
            }
            mapper.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES);
	        return mapper.readerFor(type).with(bootstrapSchema).readValues(data);

        } catch (Exception e) {
        	log.error("Problem processing uploaded CSV data", e);
        	throw new MSDBException(e);
        }

    }

    private void importDrivers(String data) {
    	MappingIterator<Driver> readValues = initializeIterator(Driver.class, data);
        while (readValues.hasNext()) {
        	Driver driver = readValues.next();
        	if (driversRepository.findByNameAndSurnameAndBirthDateAllIgnoreCase(
        			driver.getName(), driver.getSurname(), driver.getBirthDate()).isEmpty()) {
	        	log.debug("Importing driver: {}", driver);
	        	driversRepository.save(driver);
	        	driverSearchRepo.save(driver);
        	} else {
        		log.warn("Driver {} already exist in the database. Skipping...", driver);
        	}
        }

    }

    private void importRacetracks(String data) {
    	MappingIterator<RacetrackWithLayoutsImportDTO> readValues = initializeIterator(RacetrackWithLayoutsImportDTO.class, data);
        Racetrack racetrack = null;
        while (readValues.hasNext()) {
        	RacetrackWithLayoutsImportDTO tmp = readValues.next();
        	if (StringUtils.isNotBlank(tmp.getRacetrackName())) {
        		//New racetrack
        		racetrack = new Racetrack();
	        	racetrack.setName(tmp.getRacetrackName());
	        	racetrack.setLocation(tmp.getLocation());
        		Racetrack found = racetrackRepository.findOne(Example.of(racetrack)).get();
        		if (found != null) {
        			racetrack = found;
        		} else {
        			racetrack = racetrackRepository.save(racetrack);
        			racetrackSearchRepo.save(racetrack);
        		}
        	}
        	if (StringUtils.isNotBlank(tmp.getLayoutName())) {
	        	RacetrackLayout layout = new RacetrackLayout();
	        	layout.setName(tmp.getLayoutName());
	        	layout.setLength(tmp.getLength());
	        	layout.setYearFirstUse(tmp.getYearFirstUse());
	        	layout.setActive(tmp.isActive());

	        	RacetrackLayout found = racetrackLayoutRepository.findOne(Example.of(layout)).get();
	        	if (found == null) {
	        		layout.setRacetrack(racetrack);
	        		racetrackLayoutRepository.save(layout);
	        		racetrackLayoutSearchRepo.save(layout);
	        	} else {
	        		//Do nothing
	        		log.warn("Skipping racetrack layout {} - already exists", layout);
	        	}
        	}
        }
    }

    private void importTeams(String data) {
    	MappingIterator<Team> readValues = initializeIterator(Team.class, data);
        while (readValues.hasNext()) {
        	Team team = readValues.next();
        	if (teamRepository.findByNameContainsIgnoreCaseOrderByNameAsc(team.getName(), PageRequest.of(0, 15))
        			.getContent().isEmpty()) {
        		log.debug("Importing team: {}", team);
	        	teamRepository.save(team);
	        	teamSearchRepo.save(team);
        	} else {
        		log.warn("Team {} already exist in the database. Skipping...", team);
        	}
        }

    }

    private void importEngines(String data) {
    	MappingIterator<EnginesImportDTO> readValues = initializeIterator(EnginesImportDTO.class, data);
        while (readValues.hasNext()) {
        	EnginesImportDTO engine = readValues.next();
        	if (engineRepository.findByName(engine.getName()).isEmpty()) {
        		log.debug("Importing engine: {}", engine);
        		Engine newEngine = engine.buildEngine();
        		List<Engine> derivedFrom = engineRepository.findByNameAndManufacturer(
        				engine.getDerivedFromName(), engine.getDerivedFromManufacturer());
        		if (derivedFrom == null || derivedFrom.isEmpty()) {
        			log.warn("Engine {} has a parent which could not be found. Skipping...", engine);
        		} else if (derivedFrom.size() > 1) {
        			log.warn("Engine {} has a parent found more than once. Skipping...", engine);
        		} else {
        			newEngine.setDerivedFrom(derivedFrom.get(0));
        		}
	        	engineRepository.save(newEngine);
	        	engineSearchRepo.save(newEngine);
        	} else {
        		log.warn("Engine {} already exist in the database. Skipping...", engine);
        	}
        }
    }

    private void importEvents(String data) {
    	MappingIterator<EventEditionImportDTO> readValues = initializeIterator(EventEditionImportDTO.class, data);
    	Event event = null;
    	EventEdition eventEdition = null;
        Racetrack racetrack = null;
        RacetrackLayout layout = null;
        SeriesEdition seriesEd = null;
        SortedSet<Category> categories = null;
        TimeZone tz = null;
        while (readValues.hasNext()) {
        	EventEditionImportDTO tmp = readValues.next();
        	if (StringUtils.isNotBlank(tmp.getEventName())) {
        		event = eventRepository.findByName(tmp.getEventName());
	        	racetrack = racetrackRepository.findByName(tmp.getRacetrackName());
	        	tz = Optional.ofNullable(racetrack)
	        			.map(r -> TimeZone.getTimeZone(r.getTimeZone()))
	        			.orElseThrow(() -> new MSDBException("Couldn't find a racetrack with name " + tmp.getRacetrackName()));

	        	layout = racetrack.getLayouts().parallelStream()
	        			.filter(l -> l.getName().equals(tmp.getLayoutName()))
	        			.findFirst().orElseThrow(() -> new MSDBException("Provided racetrack layout name is not valid: " + tmp.getLayoutName()));

	        	final String[] catNames = tmp.getCategories().split(";");
	        	categories = categoryRepository.findByNameIn(catNames);

	        	eventEdition = new EventEdition();
	        	eventEdition.setEvent(event);
	        	eventEdition.setAllowedCategories(categories);
	        	eventEdition.setEventDate(tmp.getEventDate());
	        	eventEdition.setEditionYear(tmp.getEventDate().getYear());
	        	eventEdition.setTrackLayout(layout);
	        	eventEdition.setLongEventName(tmp.getLongEventEditionName());
	        	eventEdition.setShortEventName(tmp.getShortEventName());
	        	eventEdition.setMultidriver(tmp.getMultipleDriversEntry());

	        	if (StringUtils.isNotBlank(tmp.getSeriesEditionName())) {
	        		seriesEd = seriesEditionRepository.findByEditionName(tmp.getSeriesEditionName());
	        		if (seriesEd == null) {
	        			throw new MSDBException("Provided series name is not valid: " + tmp.getSeriesEditionName());
	        		}
	        	}

	        	eventEdition = eventEditionRepository.save(eventEdition);
        		seriesEd.getEvents().add(eventEdition);
        		seriesEditionRepository.save(seriesEd);
	        	eventEditionSearchRepo.save(eventEdition);
        	}

        	//We're dealing with event edition' sessions
    		if (eventEdition == null) {
    			throw new MSDBException("Provided data could not be associated with an existing event edition");
    		}

    		EventSession session = new EventSession();
    		session.setEventEdition(eventEdition);
    		session.setName(tmp.getSessionName());
    		session.setShortname(tmp.getSessionShortName());
    		session.setSessionStartTime(tmp.getSessionStartTime().atZone(tz.toZoneId()).toInstant().toEpochMilli());
    		session.setDuration(tmp.getSessionDuration());
    		session.setSessionType(SessionType.valueOf(tmp.getSessionType().toUpperCase()));
    		session.setDurationType(DurationType.valueOf(tmp.getDurationType().toUpperCase()).getValue());
    		session.setAdditionalLap(tmp.getExtraLap());
    		session.setMaxDuration(Optional.ofNullable(tmp.getMaxDuration()).orElseGet(() -> 0));

    		if (StringUtils.isNotBlank(tmp.getPointsSystem())) {
    			PointsSystem ps = Optional.ofNullable(
    					pointsSystemRepository.findByName(tmp.getPointsSystem())).orElseThrow(() -> new MSDBException("Provided points system name is not valid: " + tmp.getPointsSystem()));
    			PointsSystemSession pss = new PointsSystemSession(ps, seriesEd, session);
    			session.addPointsSystemsSession(pss);
    		}
    		eventSessionRepository.save(session);
        }
    }

    private void importLapByLap(Long sessionId, String data) {
        EventSession session = eventSessionRepository.findById(sessionId)
            .orElseThrow(() -> new MSDBException("Invalid session id"));

    	if (sessionLapDataRepo.existsById(sessionId.toString())) {
    		sessionLapDataRepo.deleteById(sessionId.toString());
    	}
        cacheHandler.resetLapByLapCaches(sessionId);
       	MappingIterator<LapInfo> readValues = initializeIterator(LapInfo.class, data, true);
       	SessionLapData sessionLapData = new SessionLapData();
       	sessionLapData.setSessionId(sessionId.toString());
        List<EventEditionEntry> entries = entryRepository.findEventEditionEntries(session.getEventEdition().getId());
       	while (readValues.hasNext()) {
       		sessionLapData.addLapData(readValues.next());
       	}
       	sessionLapData.processData(entries);
       	sessionLapDataRepo.save(sessionLapData);
    }

    private void importResults(Long sessionId, String data) {
    	EventSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() ->new MSDBException("Invalid session id " + sessionId));

//    	if (session.isRace()) {
//    		Optional.ofNullable(session.getEventEdition().getSeriesEditions())
//    			.ifPresent(sEditions -> sEditions.forEach(se -> cacheHandler.resetWinnersCache(se.getId())));
//    	}
    	MappingIterator<SessionResultDTO> readValues = initializeIterator(SessionResultDTO.class, data);
    	EventEntryResult first = null;
        while (readValues.hasNext()) {
        	SessionResultDTO tmp = readValues.next();
        	EventEntryResult result = new EventEntryResult();
        	result.setSession(session);
        	boolean ignore = false;
        	List<EventEditionEntry> entries = entryRepository.findByEventEditionIdAndRaceNumber(session.getEventEdition().getId(), tmp.getRaceNumber());
        	if (entries == null || entries.isEmpty()) {
        		log.warn("No entry found with race number {}. Skipping...", tmp.getRaceNumber());
        	} else if (entries.size() > 1) {
        		log.warn("Found more than one entry with race number {}. Skipping...", tmp.getRaceNumber());
        	} else {
        		result.setEntry(entries.get(0));

        		result.setStartingPosition(tmp.getStartingPosition());
                Optional<Integer> finalPos = Optional.ofNullable(tmp.getFinalPosition());
        		if (finalPos.isPresent()) {
                    result.setFinalPosition(finalPos.get());
                } else {
                    String pos = tmp.getFinalPositionStr();
                    if (pos.equals("DNF")) {
                        result.setFinalPosition(900);
                    } else if (pos.equals("DNS")) {
                        result.setFinalPosition(901);
                    } else if (pos.equals("DSQ")) {
                        result.setFinalPosition(902);
                    } else if (pos.equals("NC")) {
                        result.setFinalPosition(800);
                    } else {
                        log.warn("Informed final position ({}) not recognized for entry number {}. Skipping...",
                            tmp.getFinalPosition(),
                            tmp.getRaceNumber());
                        ignore = true;
                    }
                }

	        	if (!ignore) {
		        	result.setBestLapTime(timeToMillis(tmp.getBestLapTime()));
		        	result.setStartingPosition(tmp.getStartingPosition());
		        	result.setLapsCompleted(tmp.getLapsCompleted());
		        	result.setLapsLed(tmp.getLapsLed());
		        	result.setTotalTime(timeToMillis(tmp.getTotalTime()));
		        	result.setRetired(tmp.getRetired());
		        	result.setCause(tmp.getCause());
		        	result.setPitlaneStart(tmp.getPitlaneStart());
		        	if (StringUtils.isNotBlank(tmp.getDifference())) {
		        		Long difference = timeToMillis(tmp.getDifference());
		        		if (difference != null) {
		        			result.setDifference(difference);
			        		result.setDifferenceType(1);
		        		} else {
		        			Pattern p = Pattern.compile("\\+?\\d+");
			        		Matcher m = p.matcher(tmp.getDifference());
			        		m.find();
			        		result.setDifference(new Long(Integer.parseInt(m.group())));
			        		result.setDifferenceType(2);
		        		}
		        	} else {
		        		if (result.getFinalPosition() != 1 && result.getTotalTime() != null) {
		        			if (result.getLapsCompleted() < first.getLapsCompleted()) {
		        				result.setDifference(
		        						new Long(first.getLapsCompleted() - result.getLapsCompleted()));
		        			} else {
		        				result.setDifference(result.getTotalTime() - first.getTotalTime());
		        				result.setDifferenceType(1);
		        			}
		        		}
		        	}
		        	if (result.getFinalPosition() == 1) {
		        		first = result;
		        	}
		        	if (StringUtils.isNotBlank(tmp.getSharedWithNumber())) {
		        		List<EventEditionEntry> shareds = entryRepository.findByEventEditionIdAndRaceNumber(session.getEventEdition().getId(), tmp.getSharedWithNumber());
		            	if (shareds == null || shareds.isEmpty()) {
		            		log.warn("No entry found with shared race number {}. Ignoring...", tmp.getRaceNumber());
		            	} else if (entries.size() > 1) {
		            		log.warn("Found more than one entry with shared race number {}. Ignoring...", tmp.getRaceNumber());
		            	} else {
		            		result.setSharedWith(shareds.get(0));
		            	}
		        	}
		        	resultRepository.save(result);
	        	}
        	}
        }
    }

    private Long timeToMillis(String time) {
    	if (StringUtils.isEmpty(time)) {
    		return null;
    	}
    	Pattern p = Pattern.compile("\\+?(\\d+h)?(([0-5]?\\d)[':m])?(\\d?\\d)([\\.,](\\d+))?s?");
    	Matcher m = p.matcher(time);
    	long total = 0;
    	if (m.matches()) {
    		String hoursStr = m.group(1);
    		int hours = 0;
    		if (hoursStr != null) {
    			hours = Integer.parseInt(hoursStr.substring(0, hoursStr.length() - 1));
    		}
    		int minutes;
    		if (m.group(3) != null) {
    			minutes = Integer.parseInt(m.group(3));
    		} else {
    			minutes = 0;
    		}
    		int seconds = Integer.parseInt(m.group(4));
    		int millis = Integer.parseInt(StringUtils.rightPad(m.group(6), 4, '0'));
    		total = (long)(hours * 3600 + minutes * 60 + seconds) * 10000 + millis;
    	} else {
    		log.warn("The provided time {} is not valid. Ignoring it", time);
    		return null;
    	}
    	return new Long(total);
    }

}
