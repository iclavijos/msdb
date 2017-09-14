package com.icesoft.msdb.web.rest;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.repository.DriverRepository;
import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.RacetrackRepository;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.repository.TeamRepository;
import com.icesoft.msdb.service.dto.CalendarDTO;

@RestController
@RequestMapping("/api")
public class HomeResource {
	
	private final Logger log = LoggerFactory.getLogger(HomeResource.class);
	
	private final DriverRepository driversRepository;
	private final RacetrackRepository racetrackRepository;
	private final SeriesEditionRepository seriesEditionRepository;
	private final TeamRepository teamRepository;
	private final EventEditionRepository eventsEditionsRepository;
	private final EventSessionRepository eventSessionRepository;

	public HomeResource(DriverRepository driverRepo, RacetrackRepository racetrackRepo, 
			SeriesEditionRepository seriesRepo, TeamRepository teamRepo, EventEditionRepository eventsRepo,
			EventSessionRepository eventSessionRepo) {
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
        
        long drivers = driversRepository.count();
        long racetracks = racetrackRepository.count();
        long series = seriesEditionRepository.count();
        long teams = teamRepository.count();
        long events = eventsEditionsRepository.count();
        
        JSONObject mainObj = new JSONObject();
        try {
        	mainObj.put("drivers", drivers);
        	mainObj.put("racetracks", racetracks);
        	mainObj.put("series", series);
        	mainObj.put("teams", teams);
        	mainObj.put("events", events);
        } catch (JSONException ex) {
        	log.error("Exception processing response data", ex);
        }
        return mainObj.toString();
    }
	
	@GetMapping("/home/calendar")
	@Timed
	@Cacheable(cacheNames="calendar")
	public List<CalendarDTO> getCalendar() {
		log.debug("REST request to get calendar");
		
		LocalDateTime todayMidnight = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
		ZonedDateTime today = ZonedDateTime.of(todayMidnight, ZoneId.of("UTC"));
		ZonedDateTime nextSunday = today.with(TemporalAdjusters.next(DayOfWeek.SUNDAY));
		nextSunday = nextSunday.plusWeeks(1).withHour(23).withMinute(59).plusDays(1);
		List<EventSession> sessions = eventSessionRepository.findUpcomingSessions(today, nextSunday);

		List<CalendarDTO> calendar = new ArrayList<>();
		LocalDate currentDate = null;
		List<EventSession> daySessions = new ArrayList<>();
		if (sessions != null & !sessions.isEmpty()) {
			currentDate = sessions.get(0).getSessionStartTime().toLocalDate();
		}
		ZonedDateTime now = ZonedDateTime.now(ZoneId.of("UTC"));
		List<EventSession> filtered = sessions.stream().filter(session -> !session.isFinished(now)).collect(Collectors.toList());
		for(EventSession s : filtered) {
			if (currentDate.equals(s.getSessionStartTime().toLocalDate())) {
				daySessions.add(s);
			} else {
				CalendarDTO day = new CalendarDTO(currentDate, daySessions);
				calendar.add(day);
				currentDate = s.getSessionStartTime().toLocalDate();
				daySessions = new ArrayList<>();
				daySessions.add(s);
			}
		}
		if (!daySessions.isEmpty()) {
			CalendarDTO day = new CalendarDTO(currentDate, daySessions);
			calendar.add(day);
		}
		
		return calendar;
	}
}
