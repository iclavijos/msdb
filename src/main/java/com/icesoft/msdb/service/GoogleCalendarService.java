package com.icesoft.msdb.service;

import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.AclRule;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.repository.jpa.CalendarSessionRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@AllArgsConstructor
public class GoogleCalendarService {

    private Calendar service;
    private CalendarSessionRepository calendarSessionRepository;

    public String createSeriesCalendar(SeriesEdition seriesEdition) {
        com.google.api.services.calendar.model.Calendar calendar = new com.google.api.services.calendar.model.Calendar();
        calendar.setSummary(seriesEdition.getEditionName());
        calendar.setTimeZone("UTC");

        AclRule rule = new AclRule();
        AclRule.Scope scope = new AclRule.Scope();
        scope.setType("default");
        rule.setScope(scope).setRole("reader");
        AclRule ownerRule = new AclRule();
        AclRule.Scope ownerScope = new AclRule.Scope();
        ownerScope.setType("user").setValue("iclavijos@gmail.com");
        ownerRule.setScope(ownerScope).setRole("owner");
        try {
            calendar = service.calendars().insert(calendar).execute();
            log.trace("Calendar created: {}", calendar);
            rule = service.acl().insert(calendar.getId(), rule).execute();
            ownerRule = service.acl().insert(calendar.getId(), ownerRule).execute();
            log.trace("ACL rules created: {}, {}", rule, ownerRule);
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

    public void updateSeriesCalendar(SeriesEdition seriesEdition) {
        com.google.api.services.calendar.model.Calendar calendar = new com.google.api.services.calendar.model.Calendar();
        calendar.setSummary(seriesEdition.getEditionName());

        try {
            service.calendars().update(seriesEdition.getCalendarId(), calendar).execute();
        } catch (IOException e) {
            log.error("Calendar could not be removed", e);
            throw new MSDBException(e);
        }
    }

    public void addSession(SeriesEdition seriesEdition, EventEdition eventEdition, EventSession session) {
        Event calendarEvent = generateCalendarEvent(eventEdition, session);

        Map<CalendarSessionPK, CalendarSession> calendarsSession = calendarSessionRepository.findByEventSessionId(session.getId())
            .stream().collect(Collectors.toMap(CalendarSession::getId, calendarSession -> calendarSession));

        CalendarSession calSession;
        try {
            Event calEvent = service.events().insert(seriesEdition.getCalendarId(), calendarEvent).execute();
            calSession = Optional.ofNullable(calendarsSession.get(new CalendarSessionPK(session.getId(), seriesEdition.getId())))
                .orElse(new CalendarSession(seriesEdition, session));
            calSession.setCalendarId(calEvent.getId());
            log.trace("Session added to calendar: {}", calEvent);
            calendarSessionRepository.save(calSession);
        } catch (IOException e) {
            log.error("Session {} couldn't be added to calendar: {}", session.getName(), e.getLocalizedMessage());
            throw new MSDBException(e);
        }
    }

    public void modifySession(EventEdition eventEdition, EventSession session) {
        eventEdition.getSeriesEditions().forEach(seriesEdition -> {
            List<CalendarSession> calendarSessions = calendarSessionRepository.findBySeriesEditionIdEventSessionId(
                seriesEdition.getId(), session.getId()
            );
            calendarSessions.forEach(calendarSession -> {
                try {
                    Event event = generateCalendarEvent(eventEdition, session);
                    service.events().update(seriesEdition.getCalendarId(), calendarSession.getCalendarId(), event).execute();
                } catch (IOException e) {
                    log.error("Session {} couldn't be added to calendar: {}", session.getName(), e.getLocalizedMessage());
                    throw new MSDBException(e);
                }
            });
        });
    }

    public void removeSession(EventEdition eventEdition, EventSession session) {
        removeSession(null, eventEdition, session);
    }

    public void removeSession(SeriesEdition seriesEdition, EventEdition eventEdition, EventSession session) {
        List<SeriesEdition> series = seriesEdition != null ?
            List.of(seriesEdition) :
            eventEdition.getSeriesEditions().stream().toList();

        series.forEach(sEdition -> {
            try {
                List<CalendarSession> calendarSessions = calendarSessionRepository.findBySeriesEditionIdEventSessionId(
                    sEdition.getId(), session.getId()
                );
                if (!calendarSessions.isEmpty()) {
                    service.events().delete(sEdition.getCalendarId(), calendarSessions.get(0).getCalendarId()).execute();
                    calendarSessionRepository.deleteById(new CalendarSessionPK(session.getId(), sEdition.getId()));
                }
            } catch (IOException e) {
                log.error("Couldn't remove session {} from calendar {}", session.getName(), sEdition.getEditionName());
                throw new MSDBException(e);
            }
        });
    }

    public void addEvent(SeriesEdition seriesEdition, EventEdition eventEdition, List<EventSession> sessions) {
        sessions.forEach(session -> addSession(seriesEdition, eventEdition, session));
    }

    // TODO: Use seriesEdition
    public void removeEvent(SeriesEdition seriesEdition, EventEdition eventEdition, List<EventSession> sessions) {
        sessions.forEach(session -> {
            removeSession(seriesEdition, eventEdition, session);
            log.trace("Session removed from calendar: {}", session);
        });
    }

    private Event generateCalendarEvent(EventEdition eventEdition, EventSession session) {
        final String eventName = eventEdition.getLongEventName().concat(" - ");
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
        return calendarEvent;
    }
}
