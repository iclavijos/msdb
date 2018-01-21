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
import com.icesoft.msdb.domain.PointsSystem;
import com.icesoft.msdb.repository.PointsSystemRepository;
import com.icesoft.msdb.repository.search.PointsSystemSearchRepository;
import com.icesoft.msdb.web.rest.errors.ExceptionTranslator;

import static com.icesoft.msdb.web.rest.TestUtil.createFormattingConversionService;

/**
 * Test class for the PointsSystemResource REST controller.
 *
 * @see PointsSystemResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class PointsSystemResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_POINTS = "AAAAAAAAAA";
    private static final String UPDATED_POINTS = "BBBBBBBBBB";

    private static final Integer DEFAULT_POINTS_MOST_LEAD_LAPS = 1;
    private static final Integer UPDATED_POINTS_MOST_LEAD_LAPS = 2;

    private static final Integer DEFAULT_POINTS_FAST_LAP = 1;
    private static final Integer UPDATED_POINTS_FAST_LAP = 2;

    private static final Integer DEFAULT_POINTS_POLE = 1;
    private static final Integer UPDATED_POINTS_POLE = 2;

    private static final Integer DEFAULT_POINTS_LEAD_LAP = 1;
    private static final Integer UPDATED_POINTS_LEAD_LAP = 2;

    @Autowired
    private PointsSystemRepository pointsSystemRepository;

    @Autowired
    private PointsSystemSearchRepository pointsSystemSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPointsSystemMockMvc;

    private PointsSystem pointsSystem;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PointsSystemResource pointsSystemResource = new PointsSystemResource(pointsSystemRepository, pointsSystemSearchRepository);
        this.restPointsSystemMockMvc = MockMvcBuilders.standaloneSetup(pointsSystemResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PointsSystem createEntity(EntityManager em) {
        PointsSystem pointsSystem = new PointsSystem()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .points(DEFAULT_POINTS)
            .pointsMostLeadLaps(DEFAULT_POINTS_MOST_LEAD_LAPS)
            .pointsFastLap(DEFAULT_POINTS_FAST_LAP)
            .pointsPole(DEFAULT_POINTS_POLE)
            .pointsLeadLap(DEFAULT_POINTS_LEAD_LAP);
        return pointsSystem;
    }

    @Before
    public void initTest() {
        pointsSystemSearchRepository.deleteAll();
        pointsSystem = createEntity(em);
    }

    @Test
    @Transactional
    public void createPointsSystem() throws Exception {
        int databaseSizeBeforeCreate = pointsSystemRepository.findAll().size();

        // Create the PointsSystem
        restPointsSystemMockMvc.perform(post("/api/points-systems")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointsSystem)))
            .andExpect(status().isCreated());

        // Validate the PointsSystem in the database
        List<PointsSystem> pointsSystemList = pointsSystemRepository.findAll();
        assertThat(pointsSystemList).hasSize(databaseSizeBeforeCreate + 1);
        PointsSystem testPointsSystem = pointsSystemList.get(pointsSystemList.size() - 1);
        assertThat(testPointsSystem.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPointsSystem.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testPointsSystem.getPoints()).isEqualTo(DEFAULT_POINTS);
        assertThat(testPointsSystem.getPointsMostLeadLaps()).isEqualTo(DEFAULT_POINTS_MOST_LEAD_LAPS);
        assertThat(testPointsSystem.getPointsFastLap()).isEqualTo(DEFAULT_POINTS_FAST_LAP);
        assertThat(testPointsSystem.getPointsPole()).isEqualTo(DEFAULT_POINTS_POLE);
        assertThat(testPointsSystem.getPointsLeadLap()).isEqualTo(DEFAULT_POINTS_LEAD_LAP);

        // Validate the PointsSystem in Elasticsearch
        PointsSystem pointsSystemEs = pointsSystemSearchRepository.findOne(testPointsSystem.getId());
        assertThat(pointsSystemEs).isEqualTo(testPointsSystem);
    }

    @Test
    @Transactional
    public void createPointsSystemWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = pointsSystemRepository.findAll().size();

        // Create the PointsSystem with an existing ID
        pointsSystem.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPointsSystemMockMvc.perform(post("/api/points-systems")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointsSystem)))
            .andExpect(status().isBadRequest());

        // Validate the PointsSystem in the database
        List<PointsSystem> pointsSystemList = pointsSystemRepository.findAll();
        assertThat(pointsSystemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = pointsSystemRepository.findAll().size();
        // set the field null
        pointsSystem.setName(null);

        // Create the PointsSystem, which fails.

        restPointsSystemMockMvc.perform(post("/api/points-systems")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointsSystem)))
            .andExpect(status().isBadRequest());

        List<PointsSystem> pointsSystemList = pointsSystemRepository.findAll();
        assertThat(pointsSystemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = pointsSystemRepository.findAll().size();
        // set the field null
        pointsSystem.setDescription(null);

        // Create the PointsSystem, which fails.

        restPointsSystemMockMvc.perform(post("/api/points-systems")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointsSystem)))
            .andExpect(status().isBadRequest());

        List<PointsSystem> pointsSystemList = pointsSystemRepository.findAll();
        assertThat(pointsSystemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPointsSystems() throws Exception {
        // Initialize the database
        pointsSystemRepository.saveAndFlush(pointsSystem);

        // Get all the pointsSystemList
        restPointsSystemMockMvc.perform(get("/api/points-systems?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pointsSystem.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS.toString())))
            .andExpect(jsonPath("$.[*].pointsMostLeadLaps").value(hasItem(DEFAULT_POINTS_MOST_LEAD_LAPS)))
            .andExpect(jsonPath("$.[*].pointsFastLap").value(hasItem(DEFAULT_POINTS_FAST_LAP)))
            .andExpect(jsonPath("$.[*].pointsPole").value(hasItem(DEFAULT_POINTS_POLE)))
            .andExpect(jsonPath("$.[*].pointsLeadLap").value(hasItem(DEFAULT_POINTS_LEAD_LAP)));
    }

    @Test
    @Transactional
    public void getPointsSystem() throws Exception {
        // Initialize the database
        pointsSystemRepository.saveAndFlush(pointsSystem);

        // Get the pointsSystem
        restPointsSystemMockMvc.perform(get("/api/points-systems/{id}", pointsSystem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(pointsSystem.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.points").value(DEFAULT_POINTS.toString()))
            .andExpect(jsonPath("$.pointsMostLeadLaps").value(DEFAULT_POINTS_MOST_LEAD_LAPS))
            .andExpect(jsonPath("$.pointsFastLap").value(DEFAULT_POINTS_FAST_LAP))
            .andExpect(jsonPath("$.pointsPole").value(DEFAULT_POINTS_POLE))
            .andExpect(jsonPath("$.pointsLeadLap").value(DEFAULT_POINTS_LEAD_LAP));
    }

    @Test
    @Transactional
    public void getNonExistingPointsSystem() throws Exception {
        // Get the pointsSystem
        restPointsSystemMockMvc.perform(get("/api/points-systems/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePointsSystem() throws Exception {
        // Initialize the database
        pointsSystemRepository.saveAndFlush(pointsSystem);
        pointsSystemSearchRepository.save(pointsSystem);
        int databaseSizeBeforeUpdate = pointsSystemRepository.findAll().size();

        // Update the pointsSystem
        PointsSystem updatedPointsSystem = pointsSystemRepository.findOne(pointsSystem.getId());
        updatedPointsSystem
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .points(UPDATED_POINTS)
            .pointsMostLeadLaps(UPDATED_POINTS_MOST_LEAD_LAPS)
            .pointsFastLap(UPDATED_POINTS_FAST_LAP)
            .pointsPole(UPDATED_POINTS_POLE)
            .pointsLeadLap(UPDATED_POINTS_LEAD_LAP);

        restPointsSystemMockMvc.perform(put("/api/points-systems")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPointsSystem)))
            .andExpect(status().isOk());

        // Validate the PointsSystem in the database
        List<PointsSystem> pointsSystemList = pointsSystemRepository.findAll();
        assertThat(pointsSystemList).hasSize(databaseSizeBeforeUpdate);
        PointsSystem testPointsSystem = pointsSystemList.get(pointsSystemList.size() - 1);
        assertThat(testPointsSystem.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPointsSystem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPointsSystem.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testPointsSystem.getPointsMostLeadLaps()).isEqualTo(UPDATED_POINTS_MOST_LEAD_LAPS);
        assertThat(testPointsSystem.getPointsFastLap()).isEqualTo(UPDATED_POINTS_FAST_LAP);
        assertThat(testPointsSystem.getPointsPole()).isEqualTo(UPDATED_POINTS_POLE);
        assertThat(testPointsSystem.getPointsLeadLap()).isEqualTo(UPDATED_POINTS_LEAD_LAP);

        // Validate the PointsSystem in Elasticsearch
        PointsSystem pointsSystemEs = pointsSystemSearchRepository.findOne(testPointsSystem.getId());
        assertThat(pointsSystemEs).isEqualTo(testPointsSystem);
    }

    @Test
    @Transactional
    public void updateNonExistingPointsSystem() throws Exception {
        int databaseSizeBeforeUpdate = pointsSystemRepository.findAll().size();

        // Create the PointsSystem

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPointsSystemMockMvc.perform(put("/api/points-systems")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointsSystem)))
            .andExpect(status().isCreated());

        // Validate the PointsSystem in the database
        List<PointsSystem> pointsSystemList = pointsSystemRepository.findAll();
        assertThat(pointsSystemList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePointsSystem() throws Exception {
        // Initialize the database
        pointsSystemRepository.saveAndFlush(pointsSystem);
        pointsSystemSearchRepository.save(pointsSystem);
        int databaseSizeBeforeDelete = pointsSystemRepository.findAll().size();

        // Get the pointsSystem
        restPointsSystemMockMvc.perform(delete("/api/points-systems/{id}", pointsSystem.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean pointsSystemExistsInEs = pointsSystemSearchRepository.exists(pointsSystem.getId());
        assertThat(pointsSystemExistsInEs).isFalse();

        // Validate the database is empty
        List<PointsSystem> pointsSystemList = pointsSystemRepository.findAll();
        assertThat(pointsSystemList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPointsSystem() throws Exception {
        // Initialize the database
        pointsSystemRepository.saveAndFlush(pointsSystem);
        pointsSystemSearchRepository.save(pointsSystem);

        // Search the pointsSystem
        restPointsSystemMockMvc.perform(get("/api/_search/points-systems?query=id:" + pointsSystem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pointsSystem.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS.toString())))
            .andExpect(jsonPath("$.[*].pointsMostLeadLaps").value(hasItem(DEFAULT_POINTS_MOST_LEAD_LAPS)))
            .andExpect(jsonPath("$.[*].pointsFastLap").value(hasItem(DEFAULT_POINTS_FAST_LAP)))
            .andExpect(jsonPath("$.[*].pointsPole").value(hasItem(DEFAULT_POINTS_POLE)))
            .andExpect(jsonPath("$.[*].pointsLeadLap").value(hasItem(DEFAULT_POINTS_LEAD_LAP)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PointsSystem.class);
        PointsSystem pointsSystem1 = new PointsSystem();
        pointsSystem1.setId(1L);
        PointsSystem pointsSystem2 = new PointsSystem();
        pointsSystem2.setId(pointsSystem1.getId());
        assertThat(pointsSystem1).isEqualTo(pointsSystem2);
        pointsSystem2.setId(2L);
        assertThat(pointsSystem1).isNotEqualTo(pointsSystem2);
        pointsSystem1.setId(null);
        assertThat(pointsSystem1).isNotEqualTo(pointsSystem2);
    }
}
