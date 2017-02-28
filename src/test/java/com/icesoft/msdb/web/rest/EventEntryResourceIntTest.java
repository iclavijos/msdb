package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MotorsportsDatabaseApp;

import com.icesoft.msdb.domain.EventEntry;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.search.EventEntrySearchRepository;
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

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the EventEntryResource REST controller.
 *
 * @see EventEntryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class EventEntryResourceIntTest {

    private static final String DEFAULT_TEAM_NAME = "AAAAAAAAAA";
    private static final String UPDATED_TEAM_NAME = "BBBBBBBBBB";

    @Autowired
    private EventEntryRepository eventEntryRepository;

    @Autowired
    private EventEntrySearchRepository eventEntrySearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restEventEntryMockMvc;

    private EventEntry eventEntry;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            EventEntryResource eventEntryResource = new EventEntryResource(eventEntryRepository, eventEntrySearchRepository);
        this.restEventEntryMockMvc = MockMvcBuilders.standaloneSetup(eventEntryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
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

    @Before
    public void initTest() {
        eventEntrySearchRepository.deleteAll();
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
        EventEntry eventEntryEs = eventEntrySearchRepository.findOne(testEventEntry.getId());
        assertThat(eventEntryEs).isEqualToComparingFieldByField(testEventEntry);
    }

    @Test
    @Transactional
    public void createEventEntryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = eventEntryRepository.findAll().size();

        // Create the EventEntry with an existing ID
        EventEntry existingEventEntry = new EventEntry();
        existingEventEntry.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventEntryMockMvc.perform(post("/api/event-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingEventEntry)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<EventEntry> eventEntryList = eventEntryRepository.findAll();
        assertThat(eventEntryList).hasSize(databaseSizeBeforeCreate);
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
            .andExpect(jsonPath("$.[*].teamName").value(hasItem(DEFAULT_TEAM_NAME.toString())));
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
            .andExpect(jsonPath("$.teamName").value(DEFAULT_TEAM_NAME.toString()));
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
        eventEntrySearchRepository.save(eventEntry);
        int databaseSizeBeforeUpdate = eventEntryRepository.findAll().size();

        // Update the eventEntry
        EventEntry updatedEventEntry = eventEntryRepository.findOne(eventEntry.getId());
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
        EventEntry eventEntryEs = eventEntrySearchRepository.findOne(testEventEntry.getId());
        assertThat(eventEntryEs).isEqualToComparingFieldByField(testEventEntry);
    }

    @Test
    @Transactional
    public void updateNonExistingEventEntry() throws Exception {
        int databaseSizeBeforeUpdate = eventEntryRepository.findAll().size();

        // Create the EventEntry

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restEventEntryMockMvc.perform(put("/api/event-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEntry)))
            .andExpect(status().isCreated());

        // Validate the EventEntry in the database
        List<EventEntry> eventEntryList = eventEntryRepository.findAll();
        assertThat(eventEntryList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteEventEntry() throws Exception {
        // Initialize the database
        eventEntryRepository.saveAndFlush(eventEntry);
        eventEntrySearchRepository.save(eventEntry);
        int databaseSizeBeforeDelete = eventEntryRepository.findAll().size();

        // Get the eventEntry
        restEventEntryMockMvc.perform(delete("/api/event-entries/{id}", eventEntry.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean eventEntryExistsInEs = eventEntrySearchRepository.exists(eventEntry.getId());
        assertThat(eventEntryExistsInEs).isFalse();

        // Validate the database is empty
        List<EventEntry> eventEntryList = eventEntryRepository.findAll();
        assertThat(eventEntryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchEventEntry() throws Exception {
        // Initialize the database
        eventEntryRepository.saveAndFlush(eventEntry);
        eventEntrySearchRepository.save(eventEntry);

        // Search the eventEntry
        restEventEntryMockMvc.perform(get("/api/_search/event-entries?query=id:" + eventEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventEntry.getId().intValue())))
            .andExpect(jsonPath("$.[*].teamName").value(hasItem(DEFAULT_TEAM_NAME.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventEntry.class);
    }
}
