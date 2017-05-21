package com.icesoft.msdb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import javax.persistence.EntityManager;

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

import com.icesoft.msdb.MotorsportsDatabaseApp;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.service.SeriesEditionService;
import com.icesoft.msdb.web.rest.errors.ExceptionTranslator;

/**
 * Test class for the SeriesEditionResource REST controller.
 *
 * @see SeriesEditionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class SeriesEditionResourceIntTest {

    private static final String DEFAULT_PERIOD = "AAAAAAAAAA";
    private static final String UPDATED_PERIOD = "BBBBBBBBBB";

    private static final Boolean DEFAULT_SINGLE_CHASSIS = false;
    private static final Boolean UPDATED_SINGLE_CHASSIS = true;

    private static final Boolean DEFAULT_SINGLE_ENGINE = false;
    private static final Boolean UPDATED_SINGLE_ENGINE = true;

    private static final Boolean DEFAULT_SINGLE_TYRE = false;
    private static final Boolean UPDATED_SINGLE_TYRE = true;

    @Autowired
    private SeriesEditionService seriesEditionService;
    
    @Autowired
    private SeriesEditionRepository seriesEditionRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSeriesEditionMockMvc;

    private SeriesEdition seriesEdition;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            SeriesEditionResource seriesEditionResource = new SeriesEditionResource(seriesEditionService, seriesEditionRepository);
        this.restSeriesEditionMockMvc = MockMvcBuilders.standaloneSetup(seriesEditionResource)
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
    public static SeriesEdition createEntity(EntityManager em) {
        SeriesEdition seriesEdition = new SeriesEdition()
                .period(DEFAULT_PERIOD)
                .singleChassis(DEFAULT_SINGLE_CHASSIS)
                .singleEngine(DEFAULT_SINGLE_ENGINE)
                .singleTyre(DEFAULT_SINGLE_TYRE);
        return seriesEdition;
    }

    @Before
    public void initTest() {
        seriesEdition = createEntity(em);
    }

    @Test
    @Transactional
    public void createSeriesEdition() throws Exception {
        int databaseSizeBeforeCreate = seriesEditionRepository.findAll().size();

        // Create the SeriesEdition

        restSeriesEditionMockMvc.perform(post("/api/series-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(seriesEdition)))
            .andExpect(status().isCreated());

        // Validate the SeriesEdition in the database
        List<SeriesEdition> seriesEditionList = seriesEditionRepository.findAll();
        assertThat(seriesEditionList).hasSize(databaseSizeBeforeCreate + 1);
        SeriesEdition testSeriesEdition = seriesEditionList.get(seriesEditionList.size() - 1);
        assertThat(testSeriesEdition.getPeriod()).isEqualTo(DEFAULT_PERIOD);
        assertThat(testSeriesEdition.isSingleChassis()).isEqualTo(DEFAULT_SINGLE_CHASSIS);
        assertThat(testSeriesEdition.isSingleEngine()).isEqualTo(DEFAULT_SINGLE_ENGINE);
        assertThat(testSeriesEdition.isSingleTyre()).isEqualTo(DEFAULT_SINGLE_TYRE);

    }

    @Test
    @Transactional
    public void createSeriesEditionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = seriesEditionRepository.findAll().size();

        // Create the SeriesEdition with an existing ID
        SeriesEdition existingSeriesEdition = new SeriesEdition();
        existingSeriesEdition.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSeriesEditionMockMvc.perform(post("/api/series-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingSeriesEdition)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<SeriesEdition> seriesEditionList = seriesEditionRepository.findAll();
        assertThat(seriesEditionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkPeriodIsRequired() throws Exception {
        int databaseSizeBeforeTest = seriesEditionRepository.findAll().size();
        // set the field null
        seriesEdition.setPeriod(null);

        // Create the SeriesEdition, which fails.

        restSeriesEditionMockMvc.perform(post("/api/series-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(seriesEdition)))
            .andExpect(status().isBadRequest());

        List<SeriesEdition> seriesEditionList = seriesEditionRepository.findAll();
        assertThat(seriesEditionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSingleChassisIsRequired() throws Exception {
        int databaseSizeBeforeTest = seriesEditionRepository.findAll().size();
        // set the field null
        seriesEdition.setSingleChassis(null);

        // Create the SeriesEdition, which fails.

        restSeriesEditionMockMvc.perform(post("/api/series-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(seriesEdition)))
            .andExpect(status().isBadRequest());

        List<SeriesEdition> seriesEditionList = seriesEditionRepository.findAll();
        assertThat(seriesEditionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSingleEngineIsRequired() throws Exception {
        int databaseSizeBeforeTest = seriesEditionRepository.findAll().size();
        // set the field null
        seriesEdition.setSingleEngine(null);

        // Create the SeriesEdition, which fails.

        restSeriesEditionMockMvc.perform(post("/api/series-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(seriesEdition)))
            .andExpect(status().isBadRequest());

        List<SeriesEdition> seriesEditionList = seriesEditionRepository.findAll();
        assertThat(seriesEditionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSingleTyreIsRequired() throws Exception {
        int databaseSizeBeforeTest = seriesEditionRepository.findAll().size();
        // set the field null
        seriesEdition.setSingleTyre(null);

        // Create the SeriesEdition, which fails.

        restSeriesEditionMockMvc.perform(post("/api/series-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(seriesEdition)))
            .andExpect(status().isBadRequest());

        List<SeriesEdition> seriesEditionList = seriesEditionRepository.findAll();
        assertThat(seriesEditionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSeriesEditions() throws Exception {
        // Initialize the database
        seriesEditionRepository.saveAndFlush(seriesEdition);

        // Get all the seriesEditionList
        restSeriesEditionMockMvc.perform(get("/api/series-editions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(seriesEdition.getId().intValue())))
            .andExpect(jsonPath("$.[*].period").value(hasItem(DEFAULT_PERIOD.toString())))
            .andExpect(jsonPath("$.[*].singleChassis").value(hasItem(DEFAULT_SINGLE_CHASSIS.booleanValue())))
            .andExpect(jsonPath("$.[*].singleEngine").value(hasItem(DEFAULT_SINGLE_ENGINE.booleanValue())))
            .andExpect(jsonPath("$.[*].singleTyre").value(hasItem(DEFAULT_SINGLE_TYRE.booleanValue())));
    }

    @Test
    @Transactional
    public void getSeriesEdition() throws Exception {
        // Initialize the database
        seriesEditionRepository.saveAndFlush(seriesEdition);

        // Get the seriesEdition
        restSeriesEditionMockMvc.perform(get("/api/series-editions/{id}", seriesEdition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(seriesEdition.getId().intValue()))
            .andExpect(jsonPath("$.period").value(DEFAULT_PERIOD.toString()))
            .andExpect(jsonPath("$.singleChassis").value(DEFAULT_SINGLE_CHASSIS.booleanValue()))
            .andExpect(jsonPath("$.singleEngine").value(DEFAULT_SINGLE_ENGINE.booleanValue()))
            .andExpect(jsonPath("$.singleTyre").value(DEFAULT_SINGLE_TYRE.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingSeriesEdition() throws Exception {
        // Get the seriesEdition
        restSeriesEditionMockMvc.perform(get("/api/series-editions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSeriesEdition() throws Exception {
        // Initialize the database
        seriesEditionRepository.saveAndFlush(seriesEdition);
        int databaseSizeBeforeUpdate = seriesEditionRepository.findAll().size();

        // Update the seriesEdition
        SeriesEdition updatedSeriesEdition = seriesEditionRepository.findOne(seriesEdition.getId());
        updatedSeriesEdition
                .period(UPDATED_PERIOD)
                .singleChassis(UPDATED_SINGLE_CHASSIS)
                .singleEngine(UPDATED_SINGLE_ENGINE)
                .singleTyre(UPDATED_SINGLE_TYRE);

        restSeriesEditionMockMvc.perform(put("/api/series-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSeriesEdition)))
            .andExpect(status().isOk());

        // Validate the SeriesEdition in the database
        List<SeriesEdition> seriesEditionList = seriesEditionRepository.findAll();
        assertThat(seriesEditionList).hasSize(databaseSizeBeforeUpdate);
        SeriesEdition testSeriesEdition = seriesEditionList.get(seriesEditionList.size() - 1);
        assertThat(testSeriesEdition.getPeriod()).isEqualTo(UPDATED_PERIOD);
        assertThat(testSeriesEdition.isSingleChassis()).isEqualTo(UPDATED_SINGLE_CHASSIS);
        assertThat(testSeriesEdition.isSingleEngine()).isEqualTo(UPDATED_SINGLE_ENGINE);
        assertThat(testSeriesEdition.isSingleTyre()).isEqualTo(UPDATED_SINGLE_TYRE);

    }

    @Test
    @Transactional
    public void updateNonExistingSeriesEdition() throws Exception {
        int databaseSizeBeforeUpdate = seriesEditionRepository.findAll().size();

        // Create the SeriesEdition

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSeriesEditionMockMvc.perform(put("/api/series-editions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(seriesEdition)))
            .andExpect(status().isCreated());

        // Validate the SeriesEdition in the database
        List<SeriesEdition> seriesEditionList = seriesEditionRepository.findAll();
        assertThat(seriesEditionList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSeriesEdition() throws Exception {
        // Initialize the database
        seriesEditionRepository.saveAndFlush(seriesEdition);
        int databaseSizeBeforeDelete = seriesEditionRepository.findAll().size();

        // Get the seriesEdition
        restSeriesEditionMockMvc.perform(delete("/api/series-editions/{id}", seriesEdition.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<SeriesEdition> seriesEditionList = seriesEditionRepository.findAll();
        assertThat(seriesEditionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchSeriesEdition() throws Exception {
        // Initialize the database
        seriesEditionRepository.saveAndFlush(seriesEdition);

        // Search the seriesEdition
        restSeriesEditionMockMvc.perform(get("/api/_search/series-editions?query=id:" + seriesEdition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(seriesEdition.getId().intValue())))
            .andExpect(jsonPath("$.[*].period").value(hasItem(DEFAULT_PERIOD.toString())))
            .andExpect(jsonPath("$.[*].singleChassis").value(hasItem(DEFAULT_SINGLE_CHASSIS.booleanValue())))
            .andExpect(jsonPath("$.[*].singleEngine").value(hasItem(DEFAULT_SINGLE_ENGINE.booleanValue())))
            .andExpect(jsonPath("$.[*].singleTyre").value(hasItem(DEFAULT_SINGLE_TYRE.booleanValue())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SeriesEdition.class);
    }
}
