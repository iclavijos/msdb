package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.Category;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.domain.enums.EventStatusType;
import com.icesoft.msdb.repository.jpa.EventSessionRepository;
import com.icesoft.msdb.repository.jpa.SeriesEditionRepository;
import com.icesoft.msdb.service.SeriesEditionService;
import io.micrometer.core.annotation.Timed;
import net.fortuna.ical4j.data.CalendarOutputter;
import net.fortuna.ical4j.model.*;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.component.VTimeZone;
import net.fortuna.ical4j.model.property.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import jakarta.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

/**
 * REST controller for managing {@link Category}.
 */
@RestController
@RequestMapping("/api")
@Transactional(readOnly = true)
public class ICalendarResource {

    private final Logger log = LoggerFactory.getLogger(ICalendarResource.class);

    private final SeriesEditionService seriesEditionService;
    private final SeriesEditionRepository seriesEditionRepository;
    private final EventSessionRepository eventSessionRepository;

    public ICalendarResource(SeriesEditionService seriesEditionService,
                             SeriesEditionRepository seriesEditionRepository,
                             EventSessionRepository eventSessionRepository) {
        this.seriesEditionService = seriesEditionService;
        this.seriesEditionRepository = seriesEditionRepository;
        this.eventSessionRepository = eventSessionRepository;
    }

    @GetMapping(value = "/icalendar/{seriesEditionId}", produces = "text/calendar")
    @Timed
    public HttpEntity<byte[]> getSeriesICalendar(
        @PathVariable Long seriesEditionId, HttpServletResponse response) throws IOException {
        log.debug("REST request to get ical file for a series edition");

        SeriesEdition edition = seriesEditionRepository.findById(seriesEditionId).orElseThrow(
            () -> new MSDBException("Invalid series edition id")
        );
        List<EventEdition> events = seriesEditionService.findSeriesEvents(seriesEditionId);

        Calendar calendar = new Calendar();
        calendar.getProperties().add(Version.VERSION_2_0);
        calendar.getProperties().add(new ProdId("-//Motorsports Database//MSDB 4.1.0//EN"));
        calendar.getProperties().add(new XProperty("X-WR-CALNAME", edition.getEditionName()));
        calendar.getProperties().add(CalScale.GREGORIAN);

        TimeZoneRegistry registry = TimeZoneRegistryFactory.getInstance().createRegistry();
        TimeZone timezone = registry.getTimeZone("UTC");
        VTimeZone tz = timezone.getVTimeZone();

        events.forEach(event -> {
            List<EventSession> sessions = eventSessionRepository.findByEventEditionIdOrderBySessionStartTimeAsc(event.getId());
            sessions.forEach(session -> {
                VEvent vEvent = new VEvent(
                    new DateTime(new java.util.Date(session.getSessionStartTimeDate().toInstant().toEpochMilli()), timezone),
                    new DateTime(new java.util.Date(session.getSessionEndTime().toInstant().toEpochMilli()), timezone),
                    event.getLongEventName() + " - " + session.getName()
                );
                vEvent.getProperties().add(tz.getTimeZoneId());
                Uid uid = new Uid(session.getId().toString());
                vEvent.getProperties().add(uid);
                if (event.getStatus().equals(EventStatusType.CANCELLED)) {
                    vEvent.getProperties().add(Status.VEVENT_CANCELLED);
                } else if (event.getStatus().equals(EventStatusType.SUSPENDED)) {
                    vEvent.getProperties().add(Status.VEVENT_TENTATIVE);
                } else {
                    vEvent.getProperties().add(Status.VEVENT_CONFIRMED);
                }
                vEvent.getProperties().add(Method.PUBLISH);
                vEvent.getProperties().add(new XProperty("X-MICROSOFT-CDO-BUSYSTATUS", "FREE"));
                vEvent.getProperties().add(Transp.TRANSPARENT);
                vEvent.getProperties().add(new Location(event.getTrackLayout().getRacetrack().getName()));
                vEvent.getProperties().add(new Sequence("0"));

                calendar.getComponents().add(vEvent);
            });
        });

        CalendarOutputter outputter = new CalendarOutputter();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        outputter.output(calendar, baos);

        HttpHeaders headers = new HttpHeaders();
        response.setHeader("Content-Disposition", "attachment; filename=" + HtmlUtils.htmlEscape(edition.getEditionName()) + ".ics");

        return new HttpEntity<>(baos.toByteArray(), headers);
    }

}
