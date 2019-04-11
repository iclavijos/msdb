package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MotorsportsDatabaseApp;

import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.search.EventEditionSearchRepository;
import com.icesoft.msdb.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;


import static com.icesoft.msdb.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the EventEditionResource REST controller.
 *
 * @see EventEditionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class EventEditionResourceIntTest {

    private static final Integer DEFAULT_EDITION_YEAR = 1;
    private static final Integer UPDATED_EDITION_YEAR = 2;

    private static final String DEFAULT_SHORT_EVENT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_SHORT_EVENT_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LONG_EVENT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LONG_EVENT_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_EVENT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EVENT_DATE = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private EventEditionRepository eventEditionRepository;

    /**
     * This repository is mocked in the com.icesoft.msdb.repository.search test package.
     *
     * @see com.icesoft.msdb.repository.search.EventEditionSearchRepositoryMockConfiguration
     */
    @Autowired
    private EventEditionSearchRepository mockEventEditionSearchRepository;

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

    private MockMvc restEventEditionMockMvc;

    private EventEdition eventEdition;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EventEditionResource eventEditionResource = new EventEditionResource(eventEditionRepository, mockEventEditionSearchRepository);
        this.restEventEditionMockMvc = MockMvcBuilders.standaloneSetup(eventEditionResource)
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
    public static EventEdition createEntity(EntityManager em) {
        EventEdition eventEdition = new EventEdition()
            .editionYear(DEFAULT_EDITION_YEAR)
            .shortEventName(DEFAULT_SHORT_EVENT_NAME)
            .longEventName(DEFAULT_LONG_EVENT_NAME)
            .eventDate(DEFAULT_EVENT_DATE);
        return eventEdition;
    }

    @Before
    public void initTest() {
        eventEdition = createEntity(em);
    }

    @Test
    @Transactional
    public void createEventEdition() throws Exception {
        int databaseSizeBeforeCreate = eventEditionRepository.findAll().size();

        // Create the EventEdition
        restEventEditionMockMvc.perform(post("/api/event-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEdition)))
            .andExpect(status().isCreated());

        // Validate the EventEdition in the database
        List<EventEdition> eventEditionList = eventEditionRepository.findAll();
        assertThat(eventEditionList).hasSize(databaseSizeBeforeCreate + 1);
        EventEdition testEventEdition = eventEditionList.get(eventEditionList.size() - 1);
        assertThat(testEventEdition.getEditionYear()).isEqualTo(DEFAULT_EDITION_YEAR);
        assertThat(testEventEdition.getShortEventName()).isEqualTo(DEFAULT_SHORT_EVENT_NAME);
        assertThat(testEventEdition.getLongEventName()).isEqualTo(DEFAULT_LONG_EVENT_NAME);
        assertThat(testEventEdition.getEventDate()).isEqualTo(DEFAULT_EVENT_DATE);

        // Validate the EventEdition in Elasticsearch
        verify(mockEventEditionSearchRepository, times(1)).save(testEventEdition);
    }

    @Test
    @Transactional
    public void createEventEditionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = eventEditionRepository.findAll().size();

        // Create the EventEdition with an existing ID
        eventEdition.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventEditionMockMvc.perform(post("/api/event-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEdition)))
            .andExpect(status().isBadRequest());

        // Validate the EventEdition in the database
        List<EventEdition> eventEditionList = eventEditionRepository.findAll();
        assertThat(eventEditionList).hasSize(databaseSizeBeforeCreate);

        // Validate the EventEdition in Elasticsearch
        verify(mockEventEditionSearchRepository, times(0)).save(eventEdition);
    }

    @Test
    @Transactional
    public void checkEditionYearIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventEditionRepository.findAll().size();
        // set the field null
        eventEdition.setEditionYear(null);

        // Create the EventEdition, which fails.

        restEventEditionMockMvc.perform(post("/api/event-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEdition)))
            .andExpect(status().isBadRequest());

        List<EventEdition> eventEditionList = eventEditionRepository.findAll();
        assertThat(eventEditionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkShortEventNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventEditionRepository.findAll().size();
        // set the field null
        eventEdition.setShortEventName(null);

        // Create the EventEdition, which fails.

        restEventEditionMockMvc.perform(post("/api/event-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEdition)))
            .andExpect(status().isBadRequest());

        List<EventEdition> eventEditionList = eventEditionRepository.findAll();
        assertThat(eventEditionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLongEventNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventEditionRepository.findAll().size();
        // set the field null
        eventEdition.setLongEventName(null);

        // Create the EventEdition, which fails.

        restEventEditionMockMvc.perform(post("/api/event-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEdition)))
            .andExpect(status().isBadRequest());

        List<EventEdition> eventEditionList = eventEditionRepository.findAll();
        assertThat(eventEditionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkEventDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventEditionRepository.findAll().size();
        // set the field null
        eventEdition.setEventDate(null);

        // Create the EventEdition, which fails.

        restEventEditionMockMvc.perform(post("/api/event-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEdition)))
            .andExpect(status().isBadRequest());

        List<EventEdition> eventEditionList = eventEditionRepository.findAll();
        assertThat(eventEditionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEventEditions() throws Exception {
        // Initialize the database
        eventEditionRepository.saveAndFlush(eventEdition);

        // Get all the eventEditionList
        restEventEditionMockMvc.perform(get("/api/event-editions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventEdition.getId().intValue())))
            .andExpect(jsonPath("$.[*].editionYear").value(hasItem(DEFAULT_EDITION_YEAR)))
            .andExpect(jsonPath("$.[*].shortEventName").value(hasItem(DEFAULT_SHORT_EVENT_NAME.toString())))
            .andExpect(jsonPath("$.[*].longEventName").value(hasItem(DEFAULT_LONG_EVENT_NAME.toString())))
            .andExpect(jsonPath("$.[*].eventDate").value(hasItem(DEFAULT_EVENT_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getEventEdition() throws Exception {
        // Initialize the database
        eventEditionRepository.saveAndFlush(eventEdition);

        // Get the eventEdition
        restEventEditionMockMvc.perform(get("/api/event-editions/{id}", eventEdition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(eventEdition.getId().intValue()))
            .andExpect(jsonPath("$.editionYear").value(DEFAULT_EDITION_YEAR))
            .andExpect(jsonPath("$.shortEventName").value(DEFAULT_SHORT_EVENT_NAME.toString()))
            .andExpect(jsonPath("$.longEventName").value(DEFAULT_LONG_EVENT_NAME.toString()))
            .andExpect(jsonPath("$.eventDate").value(DEFAULT_EVENT_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingEventEdition() throws Exception {
        // Get the eventEdition
        restEventEditionMockMvc.perform(get("/api/event-editions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEventEdition() throws Exception {
        // Initialize the database
        eventEditionRepository.saveAndFlush(eventEdition);

        int databaseSizeBeforeUpdate = eventEditionRepository.findAll().size();

        // Update the eventEdition
        EventEdition updatedEventEdition = eventEditionRepository.findById(eventEdition.getId()).get();
        // Disconnect from session so that the updates on updatedEventEdition are not directly saved in db
        em.detach(updatedEventEdition);
        updatedEventEdition
            .editionYear(UPDATED_EDITION_YEAR)
            .shortEventName(UPDATED_SHORT_EVENT_NAME)
            .longEventName(UPDATED_LONG_EVENT_NAME)
            .eventDate(UPDATED_EVENT_DATE);

        restEventEditionMockMvc.perform(put("/api/event-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEventEdition)))
            .andExpect(status().isOk());

        // Validate the EventEdition in the database
        List<EventEdition> eventEditionList = eventEditionRepository.findAll();
        assertThat(eventEditionList).hasSize(databaseSizeBeforeUpdate);
        EventEdition testEventEdition = eventEditionList.get(eventEditionList.size() - 1);
        assertThat(testEventEdition.getEditionYear()).isEqualTo(UPDATED_EDITION_YEAR);
        assertThat(testEventEdition.getShortEventName()).isEqualTo(UPDATED_SHORT_EVENT_NAME);
        assertThat(testEventEdition.getLongEventName()).isEqualTo(UPDATED_LONG_EVENT_NAME);
        assertThat(testEventEdition.getEventDate()).isEqualTo(UPDATED_EVENT_DATE);

        // Validate the EventEdition in Elasticsearch
        verify(mockEventEditionSearchRepository, times(1)).save(testEventEdition);
    }

    @Test
    @Transactional
    public void updateNonExistingEventEdition() throws Exception {
        int databaseSizeBeforeUpdate = eventEditionRepository.findAll().size();

        // Create the EventEdition

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventEditionMockMvc.perform(put("/api/event-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEdition)))
            .andExpect(status().isBadRequest());

        // Validate the EventEdition in the database
        List<EventEdition> eventEditionList = eventEditionRepository.findAll();
        assertThat(eventEditionList).hasSize(databaseSizeBeforeUpdate);

        // Validate the EventEdition in Elasticsearch
        verify(mockEventEditionSearchRepository, times(0)).save(eventEdition);
    }

    @Test
    @Transactional
    public void deleteEventEdition() throws Exception {
        // Initialize the database
        eventEditionRepository.saveAndFlush(eventEdition);

        int databaseSizeBeforeDelete = eventEditionRepository.findAll().size();

        // Delete the eventEdition
        restEventEditionMockMvc.perform(delete("/api/event-editions/{id}", eventEdition.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<EventEdition> eventEditionList = eventEditionRepository.findAll();
        assertThat(eventEditionList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the EventEdition in Elasticsearch
        verify(mockEventEditionSearchRepository, times(1)).deleteById(eventEdition.getId());
    }

    @Test
    @Transactional
    public void searchEventEdition() throws Exception {
        // Initialize the database
        eventEditionRepository.saveAndFlush(eventEdition);
        when(mockEventEditionSearchRepository.search(queryStringQuery("id:" + eventEdition.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(eventEdition), PageRequest.of(0, 1), 1));
        // Search the eventEdition
        restEventEditionMockMvc.perform(get("/api/_search/event-editions?query=id:" + eventEdition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventEdition.getId().intValue())))
            .andExpect(jsonPath("$.[*].editionYear").value(hasItem(DEFAULT_EDITION_YEAR)))
            .andExpect(jsonPath("$.[*].shortEventName").value(hasItem(DEFAULT_SHORT_EVENT_NAME)))
            .andExpect(jsonPath("$.[*].longEventName").value(hasItem(DEFAULT_LONG_EVENT_NAME)))
            .andExpect(jsonPath("$.[*].eventDate").value(hasItem(DEFAULT_EVENT_DATE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventEdition.class);
        EventEdition eventEdition1 = new EventEdition();
        eventEdition1.setId(1L);
        EventEdition eventEdition2 = new EventEdition();
        eventEdition2.setId(eventEdition1.getId());
        assertThat(eventEdition1).isEqualTo(eventEdition2);
        eventEdition2.setId(2L);
        assertThat(eventEdition1).isNotEqualTo(eventEdition2);
        eventEdition1.setId(null);
        assertThat(eventEdition1).isNotEqualTo(eventEdition2);
    }
}
