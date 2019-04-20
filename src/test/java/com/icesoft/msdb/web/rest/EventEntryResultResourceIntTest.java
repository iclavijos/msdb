package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MotorsportsDatabaseApp;

import com.icesoft.msdb.domain.EventEntryResult;
import com.icesoft.msdb.repository.EventEntryResultRepository;
import com.icesoft.msdb.repository.search.EventEntryResultSearchRepository;
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
 * Test class for the EventEntryResultResource REST controller.
 *
 * @see EventEntryResultResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class EventEntryResultResourceIntTest {

    private static final Integer DEFAULT_FINAL_POSITION = 1;
    private static final Integer UPDATED_FINAL_POSITION = 2;

    private static final Long DEFAULT_TOTAL_TIME = 1L;
    private static final Long UPDATED_TOTAL_TIME = 2L;

    private static final Long DEFAULT_BEST_LAP_TIME = 1L;
    private static final Long UPDATED_BEST_LAP_TIME = 2L;

    private static final Integer DEFAULT_LAPS_COMPLETED = 1;
    private static final Integer UPDATED_LAPS_COMPLETED = 2;

    private static final Boolean DEFAULT_RETIRED = false;
    private static final Boolean UPDATED_RETIRED = true;

    @Autowired
    private EventEntryResultRepository eventEntryResultRepository;

    /**
     * This repository is mocked in the com.icesoft.msdb.repository.search test package.
     *
     * @see com.icesoft.msdb.repository.search.EventEntryResultSearchRepositoryMockConfiguration
     */
    @Autowired
    private EventEntryResultSearchRepository mockEventEntryResultSearchRepository;

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

    private MockMvc restEventEntryResultMockMvc;

    private EventEntryResult eventEntryResult;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EventEntryResultResource eventEntryResultResource = new EventEntryResultResource(eventEntryResultRepository, mockEventEntryResultSearchRepository);
        this.restEventEntryResultMockMvc = MockMvcBuilders.standaloneSetup(eventEntryResultResource)
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
    public static EventEntryResult createEntity(EntityManager em) {
        EventEntryResult eventEntryResult = new EventEntryResult()
            .finalPosition(DEFAULT_FINAL_POSITION)
            .totalTime(DEFAULT_TOTAL_TIME)
            .bestLapTime(DEFAULT_BEST_LAP_TIME)
            .lapsCompleted(DEFAULT_LAPS_COMPLETED)
            .retired(DEFAULT_RETIRED);
        return eventEntryResult;
    }

    @Before
    public void initTest() {
        eventEntryResult = createEntity(em);
    }

    @Test
    @Transactional
    public void createEventEntryResult() throws Exception {
        int databaseSizeBeforeCreate = eventEntryResultRepository.findAll().size();

        // Create the EventEntryResult
        restEventEntryResultMockMvc.perform(post("/api/event-entry-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEntryResult)))
            .andExpect(status().isCreated());

        // Validate the EventEntryResult in the database
        List<EventEntryResult> eventEntryResultList = eventEntryResultRepository.findAll();
        assertThat(eventEntryResultList).hasSize(databaseSizeBeforeCreate + 1);
        EventEntryResult testEventEntryResult = eventEntryResultList.get(eventEntryResultList.size() - 1);
        assertThat(testEventEntryResult.getFinalPosition()).isEqualTo(DEFAULT_FINAL_POSITION);
        assertThat(testEventEntryResult.getTotalTime()).isEqualTo(DEFAULT_TOTAL_TIME);
        assertThat(testEventEntryResult.getBestLapTime()).isEqualTo(DEFAULT_BEST_LAP_TIME);
        assertThat(testEventEntryResult.getLapsCompleted()).isEqualTo(DEFAULT_LAPS_COMPLETED);
        assertThat(testEventEntryResult.isRetired()).isEqualTo(DEFAULT_RETIRED);

        // Validate the EventEntryResult in Elasticsearch
        verify(mockEventEntryResultSearchRepository, times(1)).save(testEventEntryResult);
    }

    @Test
    @Transactional
    public void createEventEntryResultWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = eventEntryResultRepository.findAll().size();

        // Create the EventEntryResult with an existing ID
        eventEntryResult.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventEntryResultMockMvc.perform(post("/api/event-entry-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEntryResult)))
            .andExpect(status().isBadRequest());

        // Validate the EventEntryResult in the database
        List<EventEntryResult> eventEntryResultList = eventEntryResultRepository.findAll();
        assertThat(eventEntryResultList).hasSize(databaseSizeBeforeCreate);

        // Validate the EventEntryResult in Elasticsearch
        verify(mockEventEntryResultSearchRepository, times(0)).save(eventEntryResult);
    }

    @Test
    @Transactional
    public void getAllEventEntryResults() throws Exception {
        // Initialize the database
        eventEntryResultRepository.saveAndFlush(eventEntryResult);

        // Get all the eventEntryResultList
        restEventEntryResultMockMvc.perform(get("/api/event-entry-results?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventEntryResult.getId().intValue())))
            .andExpect(jsonPath("$.[*].finalPosition").value(hasItem(DEFAULT_FINAL_POSITION)))
            .andExpect(jsonPath("$.[*].totalTime").value(hasItem(DEFAULT_TOTAL_TIME.intValue())))
            .andExpect(jsonPath("$.[*].bestLapTime").value(hasItem(DEFAULT_BEST_LAP_TIME.intValue())))
            .andExpect(jsonPath("$.[*].lapsCompleted").value(hasItem(DEFAULT_LAPS_COMPLETED)))
            .andExpect(jsonPath("$.[*].retired").value(hasItem(DEFAULT_RETIRED.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getEventEntryResult() throws Exception {
        // Initialize the database
        eventEntryResultRepository.saveAndFlush(eventEntryResult);

        // Get the eventEntryResult
        restEventEntryResultMockMvc.perform(get("/api/event-entry-results/{id}", eventEntryResult.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(eventEntryResult.getId().intValue()))
            .andExpect(jsonPath("$.finalPosition").value(DEFAULT_FINAL_POSITION))
            .andExpect(jsonPath("$.totalTime").value(DEFAULT_TOTAL_TIME.intValue()))
            .andExpect(jsonPath("$.bestLapTime").value(DEFAULT_BEST_LAP_TIME.intValue()))
            .andExpect(jsonPath("$.lapsCompleted").value(DEFAULT_LAPS_COMPLETED))
            .andExpect(jsonPath("$.retired").value(DEFAULT_RETIRED.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingEventEntryResult() throws Exception {
        // Get the eventEntryResult
        restEventEntryResultMockMvc.perform(get("/api/event-entry-results/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEventEntryResult() throws Exception {
        // Initialize the database
        eventEntryResultRepository.saveAndFlush(eventEntryResult);

        int databaseSizeBeforeUpdate = eventEntryResultRepository.findAll().size();

        // Update the eventEntryResult
        EventEntryResult updatedEventEntryResult = eventEntryResultRepository.findById(eventEntryResult.getId()).get();
        // Disconnect from session so that the updates on updatedEventEntryResult are not directly saved in db
        em.detach(updatedEventEntryResult);
        updatedEventEntryResult
            .finalPosition(UPDATED_FINAL_POSITION)
            .totalTime(UPDATED_TOTAL_TIME)
            .bestLapTime(UPDATED_BEST_LAP_TIME)
            .lapsCompleted(UPDATED_LAPS_COMPLETED)
            .retired(UPDATED_RETIRED);

        restEventEntryResultMockMvc.perform(put("/api/event-entry-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEventEntryResult)))
            .andExpect(status().isOk());

        // Validate the EventEntryResult in the database
        List<EventEntryResult> eventEntryResultList = eventEntryResultRepository.findAll();
        assertThat(eventEntryResultList).hasSize(databaseSizeBeforeUpdate);
        EventEntryResult testEventEntryResult = eventEntryResultList.get(eventEntryResultList.size() - 1);
        assertThat(testEventEntryResult.getFinalPosition()).isEqualTo(UPDATED_FINAL_POSITION);
        assertThat(testEventEntryResult.getTotalTime()).isEqualTo(UPDATED_TOTAL_TIME);
        assertThat(testEventEntryResult.getBestLapTime()).isEqualTo(UPDATED_BEST_LAP_TIME);
        assertThat(testEventEntryResult.getLapsCompleted()).isEqualTo(UPDATED_LAPS_COMPLETED);
        assertThat(testEventEntryResult.isRetired()).isEqualTo(UPDATED_RETIRED);

        // Validate the EventEntryResult in Elasticsearch
        verify(mockEventEntryResultSearchRepository, times(1)).save(testEventEntryResult);
    }

    @Test
    @Transactional
    public void updateNonExistingEventEntryResult() throws Exception {
        int databaseSizeBeforeUpdate = eventEntryResultRepository.findAll().size();

        // Create the EventEntryResult

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventEntryResultMockMvc.perform(put("/api/event-entry-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEntryResult)))
            .andExpect(status().isBadRequest());

        // Validate the EventEntryResult in the database
        List<EventEntryResult> eventEntryResultList = eventEntryResultRepository.findAll();
        assertThat(eventEntryResultList).hasSize(databaseSizeBeforeUpdate);

        // Validate the EventEntryResult in Elasticsearch
        verify(mockEventEntryResultSearchRepository, times(0)).save(eventEntryResult);
    }

    @Test
    @Transactional
    public void deleteEventEntryResult() throws Exception {
        // Initialize the database
        eventEntryResultRepository.saveAndFlush(eventEntryResult);

        int databaseSizeBeforeDelete = eventEntryResultRepository.findAll().size();

        // Delete the eventEntryResult
        restEventEntryResultMockMvc.perform(delete("/api/event-entry-results/{id}", eventEntryResult.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<EventEntryResult> eventEntryResultList = eventEntryResultRepository.findAll();
        assertThat(eventEntryResultList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the EventEntryResult in Elasticsearch
        verify(mockEventEntryResultSearchRepository, times(1)).deleteById(eventEntryResult.getId());
    }

    @Test
    @Transactional
    public void searchEventEntryResult() throws Exception {
        // Initialize the database
        eventEntryResultRepository.saveAndFlush(eventEntryResult);
        when(mockEventEntryResultSearchRepository.search(queryStringQuery("id:" + eventEntryResult.getId())))
            .thenReturn(Collections.singletonList(eventEntryResult));
        // Search the eventEntryResult
        restEventEntryResultMockMvc.perform(get("/api/_search/event-entry-results?query=id:" + eventEntryResult.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventEntryResult.getId().intValue())))
            .andExpect(jsonPath("$.[*].finalPosition").value(hasItem(DEFAULT_FINAL_POSITION)))
            .andExpect(jsonPath("$.[*].totalTime").value(hasItem(DEFAULT_TOTAL_TIME.intValue())))
            .andExpect(jsonPath("$.[*].bestLapTime").value(hasItem(DEFAULT_BEST_LAP_TIME.intValue())))
            .andExpect(jsonPath("$.[*].lapsCompleted").value(hasItem(DEFAULT_LAPS_COMPLETED)))
            .andExpect(jsonPath("$.[*].retired").value(hasItem(DEFAULT_RETIRED.booleanValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventEntryResult.class);
        EventEntryResult eventEntryResult1 = new EventEntryResult();
        eventEntryResult1.setId(1L);
        EventEntryResult eventEntryResult2 = new EventEntryResult();
        eventEntryResult2.setId(eventEntryResult1.getId());
        assertThat(eventEntryResult1).isEqualTo(eventEntryResult2);
        eventEntryResult2.setId(2L);
        assertThat(eventEntryResult1).isNotEqualTo(eventEntryResult2);
        eventEntryResult1.setId(null);
        assertThat(eventEntryResult1).isNotEqualTo(eventEntryResult2);
    }
}
