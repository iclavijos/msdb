package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MotorsportsDatabaseApp;

import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.search.EventSessionSearchRepository;
import com.icesoft.msdb.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;


import static com.icesoft.msdb.web.rest.TestUtil.sameInstant;
import static com.icesoft.msdb.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the EventSessionResource REST controller.
 *
 * @see EventSessionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class EventSessionResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_SHORTNAME = "AAAAAAAAAA";
    private static final String UPDATED_SHORTNAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_SESSION_START_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_SESSION_START_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Integer DEFAULT_DURATION = 1;
    private static final Integer UPDATED_DURATION = 2;

    @Autowired
    private EventSessionRepository eventSessionRepository;

    /**
     * This repository is mocked in the com.icesoft.msdb.repository.search test package.
     *
     * @see com.icesoft.msdb.repository.search.EventSessionSearchRepositoryMockConfiguration
     */
    @Autowired
    private EventSessionSearchRepository mockEventSessionSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restEventSessionMockMvc;

    private EventSession eventSession;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EventSessionResource eventSessionResource = new EventSessionResource(eventSessionRepository, mockEventSessionSearchRepository);
        this.restEventSessionMockMvc = MockMvcBuilders.standaloneSetup(eventSessionResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventSession createEntity(EntityManager em) {
        EventSession eventSession = new EventSession()
            .name(DEFAULT_NAME)
            .shortname(DEFAULT_SHORTNAME)
            .sessionStartTime(DEFAULT_SESSION_START_TIME)
            .duration(DEFAULT_DURATION);
        return eventSession;
    }

    @Before
    public void initTest() {
        eventSession = createEntity(em);
    }

    @Test
    @Transactional
    public void createEventSession() throws Exception {
        int databaseSizeBeforeCreate = eventSessionRepository.findAll().size();

        // Create the EventSession
        restEventSessionMockMvc.perform(post("/api/event-sessions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventSession)))
            .andExpect(status().isCreated());

        // Validate the EventSession in the database
        List<EventSession> eventSessionList = eventSessionRepository.findAll();
        assertThat(eventSessionList).hasSize(databaseSizeBeforeCreate + 1);
        EventSession testEventSession = eventSessionList.get(eventSessionList.size() - 1);
        assertThat(testEventSession.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEventSession.getShortname()).isEqualTo(DEFAULT_SHORTNAME);
        assertThat(testEventSession.getSessionStartTime()).isEqualTo(DEFAULT_SESSION_START_TIME);
        assertThat(testEventSession.getDuration()).isEqualTo(DEFAULT_DURATION);

        // Validate the EventSession in Elasticsearch
        verify(mockEventSessionSearchRepository, times(1)).save(testEventSession);
    }

    @Test
    @Transactional
    public void createEventSessionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = eventSessionRepository.findAll().size();

        // Create the EventSession with an existing ID
        eventSession.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventSessionMockMvc.perform(post("/api/event-sessions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventSession)))
            .andExpect(status().isBadRequest());

        // Validate the EventSession in the database
        List<EventSession> eventSessionList = eventSessionRepository.findAll();
        assertThat(eventSessionList).hasSize(databaseSizeBeforeCreate);

        // Validate the EventSession in Elasticsearch
        verify(mockEventSessionSearchRepository, times(0)).save(eventSession);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventSessionRepository.findAll().size();
        // set the field null
        eventSession.setName(null);

        // Create the EventSession, which fails.

        restEventSessionMockMvc.perform(post("/api/event-sessions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventSession)))
            .andExpect(status().isBadRequest());

        List<EventSession> eventSessionList = eventSessionRepository.findAll();
        assertThat(eventSessionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkShortnameIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventSessionRepository.findAll().size();
        // set the field null
        eventSession.setShortname(null);

        // Create the EventSession, which fails.

        restEventSessionMockMvc.perform(post("/api/event-sessions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventSession)))
            .andExpect(status().isBadRequest());

        List<EventSession> eventSessionList = eventSessionRepository.findAll();
        assertThat(eventSessionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSessionStartTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventSessionRepository.findAll().size();
        // set the field null
        eventSession.setSessionStartTime(null);

        // Create the EventSession, which fails.

        restEventSessionMockMvc.perform(post("/api/event-sessions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventSession)))
            .andExpect(status().isBadRequest());

        List<EventSession> eventSessionList = eventSessionRepository.findAll();
        assertThat(eventSessionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDurationIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventSessionRepository.findAll().size();
        // set the field null
        eventSession.setDuration(null);

        // Create the EventSession, which fails.

        restEventSessionMockMvc.perform(post("/api/event-sessions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventSession)))
            .andExpect(status().isBadRequest());

        List<EventSession> eventSessionList = eventSessionRepository.findAll();
        assertThat(eventSessionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEventSessions() throws Exception {
        // Initialize the database
        eventSessionRepository.saveAndFlush(eventSession);

        // Get all the eventSessionList
        restEventSessionMockMvc.perform(get("/api/event-sessions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventSession.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].shortname").value(hasItem(DEFAULT_SHORTNAME.toString())))
            .andExpect(jsonPath("$.[*].sessionStartTime").value(hasItem(sameInstant(DEFAULT_SESSION_START_TIME))))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)));
    }
    
    @Test
    @Transactional
    public void getEventSession() throws Exception {
        // Initialize the database
        eventSessionRepository.saveAndFlush(eventSession);

        // Get the eventSession
        restEventSessionMockMvc.perform(get("/api/event-sessions/{id}", eventSession.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(eventSession.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.shortname").value(DEFAULT_SHORTNAME.toString()))
            .andExpect(jsonPath("$.sessionStartTime").value(sameInstant(DEFAULT_SESSION_START_TIME)))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION));
    }

    @Test
    @Transactional
    public void getNonExistingEventSession() throws Exception {
        // Get the eventSession
        restEventSessionMockMvc.perform(get("/api/event-sessions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEventSession() throws Exception {
        // Initialize the database
        eventSessionRepository.saveAndFlush(eventSession);

        int databaseSizeBeforeUpdate = eventSessionRepository.findAll().size();

        // Update the eventSession
        EventSession updatedEventSession = eventSessionRepository.findById(eventSession.getId()).get();
        // Disconnect from session so that the updates on updatedEventSession are not directly saved in db
        em.detach(updatedEventSession);
        updatedEventSession
            .name(UPDATED_NAME)
            .shortname(UPDATED_SHORTNAME)
            .sessionStartTime(UPDATED_SESSION_START_TIME)
            .duration(UPDATED_DURATION);

        restEventSessionMockMvc.perform(put("/api/event-sessions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEventSession)))
            .andExpect(status().isOk());

        // Validate the EventSession in the database
        List<EventSession> eventSessionList = eventSessionRepository.findAll();
        assertThat(eventSessionList).hasSize(databaseSizeBeforeUpdate);
        EventSession testEventSession = eventSessionList.get(eventSessionList.size() - 1);
        assertThat(testEventSession.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEventSession.getShortname()).isEqualTo(UPDATED_SHORTNAME);
        assertThat(testEventSession.getSessionStartTime()).isEqualTo(UPDATED_SESSION_START_TIME);
        assertThat(testEventSession.getDuration()).isEqualTo(UPDATED_DURATION);

        // Validate the EventSession in Elasticsearch
        verify(mockEventSessionSearchRepository, times(1)).save(testEventSession);
    }

    @Test
    @Transactional
    public void updateNonExistingEventSession() throws Exception {
        int databaseSizeBeforeUpdate = eventSessionRepository.findAll().size();

        // Create the EventSession

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventSessionMockMvc.perform(put("/api/event-sessions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventSession)))
            .andExpect(status().isBadRequest());

        // Validate the EventSession in the database
        List<EventSession> eventSessionList = eventSessionRepository.findAll();
        assertThat(eventSessionList).hasSize(databaseSizeBeforeUpdate);

        // Validate the EventSession in Elasticsearch
        verify(mockEventSessionSearchRepository, times(0)).save(eventSession);
    }

    @Test
    @Transactional
    public void deleteEventSession() throws Exception {
        // Initialize the database
        eventSessionRepository.saveAndFlush(eventSession);

        int databaseSizeBeforeDelete = eventSessionRepository.findAll().size();

        // Delete the eventSession
        restEventSessionMockMvc.perform(delete("/api/event-sessions/{id}", eventSession.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<EventSession> eventSessionList = eventSessionRepository.findAll();
        assertThat(eventSessionList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the EventSession in Elasticsearch
        verify(mockEventSessionSearchRepository, times(1)).deleteById(eventSession.getId());
    }

    @Test
    @Transactional
    public void searchEventSession() throws Exception {
        // Initialize the database
        eventSessionRepository.saveAndFlush(eventSession);
        when(mockEventSessionSearchRepository.search(queryStringQuery("id:" + eventSession.getId())))
            .thenReturn(Collections.singletonList(eventSession));
        // Search the eventSession
        restEventSessionMockMvc.perform(get("/api/_search/event-sessions?query=id:" + eventSession.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventSession.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].shortname").value(hasItem(DEFAULT_SHORTNAME)))
            .andExpect(jsonPath("$.[*].sessionStartTime").value(hasItem(sameInstant(DEFAULT_SESSION_START_TIME))))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventSession.class);
        EventSession eventSession1 = new EventSession();
        eventSession1.setId(1L);
        EventSession eventSession2 = new EventSession();
        eventSession2.setId(eventSession1.getId());
        assertThat(eventSession1).isEqualTo(eventSession2);
        eventSession2.setId(2L);
        assertThat(eventSession1).isNotEqualTo(eventSession2);
        eventSession1.setId(null);
        assertThat(eventSession1).isNotEqualTo(eventSession2);
    }
}
