package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.domain.enums.EventStatusType;
import com.icesoft.msdb.repository.*;
import com.icesoft.msdb.repository.impl.JDBCRepositoryImpl;
import com.icesoft.msdb.service.MessagingService;
import com.icesoft.msdb.service.dto.SessionDataDTO;
import com.icesoft.msdb.service.dto.TimeZonesResponse;
import io.micrometer.core.annotation.Timed;
import net.minidev.json.JSONObject;
import org.cloudinary.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@Transactional(readOnly=true)
public class HomeResource {

	private final Logger log = LoggerFactory.getLogger(HomeResource.class);

	private final DriverRepository driversRepository;
	private final RacetrackLayoutRepository racetrackRepository;
	private final SeriesEditionRepository seriesEditionRepository;
	private final TeamRepository teamRepository;
	private final EventEditionRepository eventsEditionsRepository;
	private final EventSessionRepository eventSessionRepository;

	@Autowired
    private UserRepository userRepository;
	@Autowired
    private MessagingService messagingService;

    @Autowired
    private String timeZoneServiceUrl;

	public HomeResource(DriverRepository driverRepo, RacetrackLayoutRepository racetrackRepo,
			SeriesEditionRepository seriesRepo, TeamRepository teamRepo, EventEditionRepository eventsRepo,
			EventSessionRepository eventSessionRepo, JDBCRepositoryImpl jdbcRepo) {
		this.driversRepository = driverRepo;
		this.racetrackRepository = racetrackRepo;
		this.seriesEditionRepository = seriesRepo;
		this.teamRepository = teamRepo;
		this.eventsEditionsRepository = eventsRepo;
		this.eventSessionRepository = eventSessionRepo;
	}

	@GetMapping("/home")
    @Timed
    @Cacheable(cacheNames="homeInfo")
    public Object getHomeInfo() {
        log.debug("REST request to get home information");

        JSONObject mainObj = new JSONObject();
        try {
        	mainObj.put("drivers", driversRepository.count());
        	mainObj.put("racetracks", racetrackRepository.count());
        	mainObj.put("series", seriesEditionRepository.count());
        	mainObj.put("teams", teamRepository.count());
        	mainObj.put("events", eventsEditionsRepository.count());
        } catch (JSONException ex) {
        	log.error("Exception processing response data", ex);
        }
        return mainObj.toString();
    }

	@GetMapping("/home/calendar")
	@Timed
	@Cacheable(cacheNames="calendar")
	public List<SessionDataDTO> getCalendar() {
		log.debug("REST request to get calendar");

		LocalDateTime todayMidnight = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
		ZonedDateTime today = ZonedDateTime.of(todayMidnight, ZoneId.of("UTC"));
		ZonedDateTime nextSunday = today.with(TemporalAdjusters.next(DayOfWeek.SUNDAY));
		nextSunday = nextSunday.plusWeeks(1).withHour(23).withMinute(59).plusDays(1);
		List<EventSession> sessions = eventSessionRepository
            .findUpcomingSessions(
                today.toEpochSecond(),
                nextSunday.toEpochSecond());

		ZonedDateTime now = ZonedDateTime.now(ZoneId.of("UTC"));
		List<SessionDataDTO> filtered =
				sessions.parallelStream().filter(session -> !session.isFinished(now))
                    .filter(session -> session.getEventEdition().getStatus().equals(EventStatusType.ONGOING))
					.map(SessionDataDTO::new)
					.sorted(Comparator.comparing(SessionDataDTO::getSessionStartTime))
					.collect(Collectors.toList());

		return filtered;
	}

	@GetMapping("/home/ephemeris/{today}")
    @Timed
    @Cacheable(cacheNames = "ephemeris", key="#today")
    public ResponseEntity<List<Ephemeris.EphemerisItem>> getTodayEphemeris(@PathVariable String today) {
        String[] data = today.split("-");
        int day, month;
        if (data.length != 2) {
            throw new MSDBException("Invalid day format supplied");
        } else {
            try {
                day = Integer.parseInt(data[0]);
                month = Integer.parseInt(data[1]);
            } catch (NumberFormatException e) {
                throw new MSDBException("Invalid date supplied");
            }
        }
	    List<Driver> bornDrivers = driversRepository.findBornOnDay(day, month);
        List<Driver> deadDrivers = driversRepository.findDeadOnDay(day, month);
        List<EventSession> events = eventSessionRepository.findRacesOnDay(day, month);
        Ephemeris result = new Ephemeris(bornDrivers, deadDrivers, events);
        return ResponseEntity.ok(
            result.getEphemerisItems().parallelStream().filter(
                e -> e.getDate().getYear() != LocalDate.now().getYear())
                .collect(Collectors.toList())
            );
    }

	@GetMapping("/timezones")
	@Cacheable(cacheNames="timezones")
	public List<TimeZone> getTimeZones() {
		RestTemplate restTemplate = new RestTemplate();
        TimeZonesResponse timezonesResp = restTemplate.getForObject(
            timeZoneServiceUrl,
            TimeZonesResponse.class);
        if (!timezonesResp.getStatus().equals("OK")) {
        	throw new MSDBException("Error retrieving timezones: " + timezonesResp.getMessage());
        }

        List<TimeZone> timeZones = timezonesResp.getZones().stream()
            .sorted(
                Comparator.comparing(TimeZone::getCountryName)
                    .thenComparing(TimeZone::getZoneName))
            .collect(Collectors.toList());

        // This is just an internal joke :P
        TimeZone nerdTZ = new TimeZone("Toledo Hora imperial", "Europe/London", 0L);
        timeZones.add(nerdTZ);

        return timeZones;
	}

	@GetMapping("/home/testNotif/{email}/{sessionId}")
    public void testNotif(@PathVariable String email, @PathVariable Long sessionId) {
        User ivan = userRepository.findOneByEmailIgnoreCase(email).get();
        EventSession session = eventSessionRepository.findById(sessionId).get();
        messagingService.sendSessionNotification(ivan, session);
    }
}
