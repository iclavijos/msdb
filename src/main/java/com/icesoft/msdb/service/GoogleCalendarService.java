package com.icesoft.msdb.service;

import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.AclRule;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.repository.jpa.CalendarSessionRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class GoogleCalendarService {

    @Autowired
    private Calendar service;
    @Autowired
    private CalendarSessionRepository calendarSessionRepository;

    public String createSeriesCalendar(SeriesEdition seriesEdition) {
        com.google.api.services.calendar.model.Calendar calendar = new com.google.api.services.calendar.model.Calendar();
        calendar.setSummary(seriesEdition.getEditionName());
        calendar.setTimeZone("UTC");

        AclRule rule = new AclRule();
        AclRule.Scope scope = new AclRule.Scope();
        scope.setType("default");
        rule.setScope(scope).setRole("reader");
        try {
            calendar = service.calendars().insert(calendar).execute();
            log.trace("Calendar created: {}", calendar);
            rule = service.acl().insert(calendar.getId(), rule).execute();
            log.trace("ACL rule created: {}", rule);
            return calendar.getId();
        } catch (IOException e) {
            log.error("Calendar could not be created", e);
            throw new MSDBException(e);
        }
    }

    public void removeSeriesCalendar(SeriesEdition seriesEdition) {
        try {
            service.calendars().delete(seriesEdition.getCalendarId()).execute();
        } catch (IOException e) {
            log.error("Calendar could not be removed", e);
            throw new MSDBException(e);
        }
    }

    public void addEvent(SeriesEdition seriesEdition, EventEdition eventEdition, List<EventSession> sessions) {
        final String eventName = eventEdition.getLongEventName().concat(" - ");
        sessions.forEach(session -> {
            Event calendarEvent = new Event()
                .setSummary(eventName.concat(session.getName()))
                .setLocation(
                    eventEdition.getEvent().isRaid() || eventEdition.getEvent().isRally() ?
                        eventEdition.getLocation() :
                        eventEdition.getTrackLayout().getRacetrack().getName()
                );
            EventDateTime start = new EventDateTime()
                .setDateTime(new DateTime(session.getSessionStartTime().toEpochMilli()));
            EventDateTime end = new EventDateTime()
                .setDateTime(new DateTime(session.getSessionEndTime().toInstant().toEpochMilli()));
            calendarEvent.setStart(start);
            calendarEvent.setEnd(end);

            Map<CalendarSessionPK, CalendarSession> calendarsSession = calendarSessionRepository.findByEventSessionId(session.getId())
                .stream().collect(Collectors.toMap(calendarSession -> calendarSession.getId(), calendarSession -> calendarSession));


            CalendarSession calSession;
            try {
                Event calEvent = service.events().insert(seriesEdition.getCalendarId(), calendarEvent).execute();
                calSession = Optional.ofNullable(calendarsSession.get(new CalendarSessionPK(session.getId(), seriesEdition.getId())))
                    .orElse(new CalendarSession());
                calSession.setCalendarId(calEvent.getId());
                log.trace("Session added to calendar: {}", calEvent);
                calendarSessionRepository.save(calSession);
            } catch (IOException e) {
                log.error("Session {} couldn't be added to calendar: {}", e.getLocalizedMessage());
                throw new MSDBException(e);
            }
        });
    }

    public void removeEvent(SeriesEdition seriesEdition, List<EventSession> sessions) {
        sessions.forEach(session -> {
            // TODO: All this needs a good rethink
            calendarSessionRepository.findByEventSessionId(session.getId()).stream()
                .filter(calendarSession -> calendarSession.getId().getSeriesEditionId().equals(seriesEdition.getId()));
            try {
                service.events().delete(seriesEdition.getCalendarId(), "").execute();
            } catch (IOException e) {
                log.error("Session {} couldn't be added to calendar: {}", e.getLocalizedMessage());
                throw new MSDBException(e);
            }
            log.trace("Session removed from calendar: {}", session);
        });
    }
}
