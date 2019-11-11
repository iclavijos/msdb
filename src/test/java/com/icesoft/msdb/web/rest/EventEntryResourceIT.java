package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MotorsportsDatabaseApp;
import com.icesoft.msdb.domain.EventEntry;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.search.EventEntrySearchRepository;
import com.icesoft.msdb.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
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
 * Integration tests for the {@link EventEntryResource} REST controller.
 */
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class EventEntryResourceIT {

    private static final String DEFAULT_TEAM_NAME = "AAAAAAAAAA";
    private static final String UPDATED_TEAM_NAME = "BBBBBBBBBB";

    @Autowired
    private EventEntryRepository eventEntryRepository;

    /**
     * This repository is mocked in the com.icesoft.msdb.repository.search test package.
     *
     * @see com.icesoft.msdb.repository.search.EventEntrySearchRepositoryMockConfiguration
     */
    @Autowired
    private EventEntrySearchRepository mockEventEntrySearchRepository;

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

    private MockMvc restEventEntryMockMvc;

    private EventEntry eventEntry;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EventEntryResource eventEntryResource = new EventEntryResource(eventEntryRepository, mockEventEntrySearchRepository);
        this.restEventEntryMockMvc = MockMvcBuilders.standaloneSetup(eventEntryResource)
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
    public static EventEntry createEntity(EntityManager em) {
        EventEntry eventEntry = new EventEntry()
            .teamName(DEFAULT_TEAM_NAME);
        return eventEntry;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventEntry createUpdatedEntity(EntityManager em) {
        EventEntry eventEntry = new EventEntry()
            .teamName(UPDATED_TEAM_NAME);
        return eventEntry;
    }

    @BeforeEach
    public void initTest() {
        eventEntry = createEntity(em);
    }

    @Test
    @Transactional
    public void createEventEntry() throws Exception {
        int databaseSizeBeforeCreate = eventEntryRepository.findAll().size();

        // Create the EventEntry
        restEventEntryMockMvc.perform(post("/api/event-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEntry)))
            .andExpect(status().isCreated());

        // Validate the EventEntry in the database
        List<EventEntry> eventEntryList = eventEntryRepository.findAll();
        assertThat(eventEntryList).hasSize(databaseSizeBeforeCreate + 1);
        EventEntry testEventEntry = eventEntryList.get(eventEntryList.size() - 1);
        assertThat(testEventEntry.getTeamName()).isEqualTo(DEFAULT_TEAM_NAME);

        // Validate the EventEntry in Elasticsearch
        verify(mockEventEntrySearchRepository, times(1)).save(testEventEntry);
    }

    @Test
    @Transactional
    public void createEventEntryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = eventEntryRepository.findAll().size();

        // Create the EventEntry with an existing ID
        eventEntry.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventEntryMockMvc.perform(post("/api/event-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEntry)))
            .andExpect(status().isBadRequest());

        // Validate the EventEntry in the database
        List<EventEntry> eventEntryList = eventEntryRepository.findAll();
        assertThat(eventEntryList).hasSize(databaseSizeBeforeCreate);

        // Validate the EventEntry in Elasticsearch
        verify(mockEventEntrySearchRepository, times(0)).save(eventEntry);
    }


    @Test
    @Transactional
    public void checkTeamNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventEntryRepository.findAll().size();
        // set the field null
        eventEntry.setTeamName(null);

        // Create the EventEntry, which fails.

        restEventEntryMockMvc.perform(post("/api/event-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEntry)))
            .andExpect(status().isBadRequest());

        List<EventEntry> eventEntryList = eventEntryRepository.findAll();
        assertThat(eventEntryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEventEntries() throws Exception {
        // Initialize the database
        eventEntryRepository.saveAndFlush(eventEntry);

        // Get all the eventEntryList
        restEventEntryMockMvc.perform(get("/api/event-entries?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventEntry.getId().intValue())))
            .andExpect(jsonPath("$.[*].teamName").value(hasItem(DEFAULT_TEAM_NAME)));
    }
    
    @Test
    @Transactional
    public void getEventEntry() throws Exception {
        // Initialize the database
        eventEntryRepository.saveAndFlush(eventEntry);

        // Get the eventEntry
        restEventEntryMockMvc.perform(get("/api/event-entries/{id}", eventEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(eventEntry.getId().intValue()))
            .andExpect(jsonPath("$.teamName").value(DEFAULT_TEAM_NAME));
    }

    @Test
    @Transactional
    public void getNonExistingEventEntry() throws Exception {
        // Get the eventEntry
        restEventEntryMockMvc.perform(get("/api/event-entries/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEventEntry() throws Exception {
        // Initialize the database
        eventEntryRepository.saveAndFlush(eventEntry);

        int databaseSizeBeforeUpdate = eventEntryRepository.findAll().size();

        // Update the eventEntry
        EventEntry updatedEventEntry = eventEntryRepository.findById(eventEntry.getId()).get();
        // Disconnect from session so that the updates on updatedEventEntry are not directly saved in db
        em.detach(updatedEventEntry);
        updatedEventEntry
            .teamName(UPDATED_TEAM_NAME);

        restEventEntryMockMvc.perform(put("/api/event-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEventEntry)))
            .andExpect(status().isOk());

        // Validate the EventEntry in the database
        List<EventEntry> eventEntryList = eventEntryRepository.findAll();
        assertThat(eventEntryList).hasSize(databaseSizeBeforeUpdate);
        EventEntry testEventEntry = eventEntryList.get(eventEntryList.size() - 1);
        assertThat(testEventEntry.getTeamName()).isEqualTo(UPDATED_TEAM_NAME);

        // Validate the EventEntry in Elasticsearch
        verify(mockEventEntrySearchRepository, times(1)).save(testEventEntry);
    }

    @Test
    @Transactional
    public void updateNonExistingEventEntry() throws Exception {
        int databaseSizeBeforeUpdate = eventEntryRepository.findAll().size();

        // Create the EventEntry

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventEntryMockMvc.perform(put("/api/event-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEntry)))
            .andExpect(status().isBadRequest());

        // Validate the EventEntry in the database
        List<EventEntry> eventEntryList = eventEntryRepository.findAll();
        assertThat(eventEntryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the EventEntry in Elasticsearch
        verify(mockEventEntrySearchRepository, times(0)).save(eventEntry);
    }

    @Test
    @Transactional
    public void deleteEventEntry() throws Exception {
        // Initialize the database
        eventEntryRepository.saveAndFlush(eventEntry);

        int databaseSizeBeforeDelete = eventEntryRepository.findAll().size();

        // Delete the eventEntry
        restEventEntryMockMvc.perform(delete("/api/event-entries/{id}", eventEntry.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EventEntry> eventEntryList = eventEntryRepository.findAll();
        assertThat(eventEntryList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the EventEntry in Elasticsearch
        verify(mockEventEntrySearchRepository, times(1)).deleteById(eventEntry.getId());
    }

    @Test
    @Transactional
    public void searchEventEntry() throws Exception {
        // Initialize the database
        eventEntryRepository.saveAndFlush(eventEntry);
        when(mockEventEntrySearchRepository.search(queryStringQuery("id:" + eventEntry.getId())))
            .thenReturn(Collections.singletonList(eventEntry));
        // Search the eventEntry
        restEventEntryMockMvc.perform(get("/api/_search/event-entries?query=id:" + eventEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventEntry.getId().intValue())))
            .andExpect(jsonPath("$.[*].teamName").value(hasItem(DEFAULT_TEAM_NAME)));
    }
}
