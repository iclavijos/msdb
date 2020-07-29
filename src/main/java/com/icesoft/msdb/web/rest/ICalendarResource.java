package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.Category;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.repository.CategoryRepository;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.repository.search.CategorySearchRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.SearchService;
import com.icesoft.msdb.service.SeriesEditionService;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.micrometer.core.annotation.Timed;
import net.fortuna.ical4j.data.CalendarOutputter;
import net.fortuna.ical4j.model.*;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.component.VTimeZone;
import net.fortuna.ical4j.model.property.CalScale;
import net.fortuna.ical4j.model.property.ProdId;
import net.fortuna.ical4j.model.property.Version;
import net.fortuna.ical4j.model.property.XProperty;
import net.fortuna.ical4j.util.RandomUidGenerator;
import net.fortuna.ical4j.util.UidGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.HtmlUtils;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.temporal.TemporalField;
import java.util.List;
import java.util.Optional;

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
        calendar.getProperties().add(new ProdId("-//Motorsports Database//MSDB 4.1.0//EN"));
        calendar.getProperties().add(Version.VERSION_2_0);
        calendar.getProperties().add(CalScale.GREGORIAN);
        calendar.getProperties().add(new XProperty("X-WR-CALNAME", edition.getEditionName()));

        UidGenerator uidGenerator = new RandomUidGenerator();

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
                vEvent.getProperties().add(uidGenerator.generateUid());

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
