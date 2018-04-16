package com.icesoft.msdb.web.rest;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.codahale.metrics.annotation.Timed;
import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.TimeZone;
import com.icesoft.msdb.repository.DriverRepository;
import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.RacetrackLayoutRepository;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.repository.TeamRepository;
import com.icesoft.msdb.repository.impl.JDBCRepositoryImpl;
import com.icesoft.msdb.service.dto.SessionDataDTO;
import com.icesoft.msdb.service.dto.TimeZonesResponse;

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
		List<EventSession> sessions = eventSessionRepository.findUpcomingSessions(today, nextSunday);

		ZonedDateTime now = ZonedDateTime.now(ZoneId.of("UTC"));
		List<SessionDataDTO> filtered =
				sessions.parallelStream().filter(session -> !session.isFinished(now))
					.map(SessionDataDTO::new)
					.sorted((s1,s2) -> s1.getSessionStartTime().compareTo(s2.getSessionStartTime()))
					.collect(Collectors.toList());

		return filtered;
	}

	@GetMapping("/timezones")
	@Cacheable(cacheNames="timezones")
	public List<TimeZone> getTimeZones() {
		RestTemplate restTemplate = new RestTemplate();
        TimeZonesResponse timezonesResp = restTemplate.getForObject(
        		"http://api.timezonedb.com/v2/list-time-zone?key=4CHM89W4KBP0&format=json&fields=countryName,zoneName,gmtOffset",
        		TimeZonesResponse.class);
        if (!timezonesResp.getStatus().equals("OK")) {
        	throw new MSDBException("Error retrieving timezones: " + timezonesResp.getMessage());
        }
        TimeZone nerdTZ = new TimeZone("Toledo Hora imperial", "Europe/London", 0L);
        timezonesResp.getZones().add(nerdTZ);
        return timezonesResp.getZones();
	}
}
