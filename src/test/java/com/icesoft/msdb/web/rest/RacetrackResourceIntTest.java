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
import org.springframework.util.Base64Utils;

import com.icesoft.msdb.MotorsportsDatabaseApp;
import com.icesoft.msdb.domain.Racetrack;
import com.icesoft.msdb.repository.RacetrackRepository;
import com.icesoft.msdb.repository.search.RacetrackSearchRepository;
import com.icesoft.msdb.service.RacetrackService;
import com.icesoft.msdb.web.rest.errors.ExceptionTranslator;

/**
 * Test class for the RacetrackResource REST controller.
 *
 * @see RacetrackResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class RacetrackResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LOGO_CONTENT_TYPE = "image/png";

    @Autowired
    private RacetrackRepository racetrackRepository;

    @Autowired
    private RacetrackSearchRepository racetrackSearchRepository;
    
    @Autowired
    private RacetrackService racetrackService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restRacetrackMockMvc;

    private Racetrack racetrack;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            RacetrackResource racetrackResource = new RacetrackResource(racetrackService);
        this.restRacetrackMockMvc = MockMvcBuilders.standaloneSetup(racetrackResource)
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
    public static Racetrack createEntity(EntityManager em) {
        Racetrack racetrack = new Racetrack()
                .name(DEFAULT_NAME)
                .location(DEFAULT_LOCATION)
                .logo(DEFAULT_LOGO)
                .logoContentType(DEFAULT_LOGO_CONTENT_TYPE);
        return racetrack;
    }

    @Before
    public void initTest() {
        racetrackSearchRepository.deleteAll();
        racetrack = createEntity(em);
    }

    @Test
    @Transactional
    public void createRacetrack() throws Exception {
        int databaseSizeBeforeCreate = racetrackRepository.findAll().size();

        // Create the Racetrack

        restRacetrackMockMvc.perform(post("/api/racetracks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(racetrack)))
            .andExpect(status().isCreated());

        // Validate the Racetrack in the database
        List<Racetrack> racetrackList = racetrackRepository.findAll();
        assertThat(racetrackList).hasSize(databaseSizeBeforeCreate + 1);
        Racetrack testRacetrack = racetrackList.get(racetrackList.size() - 1);
        assertThat(testRacetrack.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testRacetrack.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testRacetrack.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testRacetrack.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);

        // Validate the Racetrack in Elasticsearch
        Racetrack racetrackEs = racetrackSearchRepository.findOne(testRacetrack.getId());
        assertThat(racetrackEs).isEqualToComparingFieldByField(testRacetrack);
    }

    @Test
    @Transactional
    public void createRacetrackWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = racetrackRepository.findAll().size();

        // Create the Racetrack with an existing ID
        Racetrack existingRacetrack = new Racetrack();
        existingRacetrack.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRacetrackMockMvc.perform(post("/api/racetracks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingRacetrack)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Racetrack> racetrackList = racetrackRepository.findAll();
        assertThat(racetrackList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = racetrackRepository.findAll().size();
        // set the field null
        racetrack.setName(null);

        // Create the Racetrack, which fails.

        restRacetrackMockMvc.perform(post("/api/racetracks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(racetrack)))
            .andExpect(status().isBadRequest());

        List<Racetrack> racetrackList = racetrackRepository.findAll();
        assertThat(racetrackList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLocationIsRequired() throws Exception {
        int databaseSizeBeforeTest = racetrackRepository.findAll().size();
        // set the field null
        racetrack.setLocation(null);

        // Create the Racetrack, which fails.

        restRacetrackMockMvc.perform(post("/api/racetracks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(racetrack)))
            .andExpect(status().isBadRequest());

        List<Racetrack> racetrackList = racetrackRepository.findAll();
        assertThat(racetrackList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllRacetracks() throws Exception {
        // Initialize the database
        racetrackRepository.saveAndFlush(racetrack);

        // Get all the racetrackList
        restRacetrackMockMvc.perform(get("/api/racetracks?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(racetrack.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION.toString())))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))));
    }

    @Test
    @Transactional
    public void getRacetrack() throws Exception {
        // Initialize the database
        racetrackRepository.saveAndFlush(racetrack);

        // Get the racetrack
        restRacetrackMockMvc.perform(get("/api/racetracks/{id}", racetrack.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(racetrack.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION.toString()))
            .andExpect(jsonPath("$.logoContentType").value(DEFAULT_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.logo").value(Base64Utils.encodeToString(DEFAULT_LOGO)));
    }

    @Test
    @Transactional
    public void getNonExistingRacetrack() throws Exception {
        // Get the racetrack
        restRacetrackMockMvc.perform(get("/api/racetracks/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRacetrack() throws Exception {
        // Initialize the database
        racetrackRepository.saveAndFlush(racetrack);
        racetrackSearchRepository.save(racetrack);
        int databaseSizeBeforeUpdate = racetrackRepository.findAll().size();

        // Update the racetrack
        Racetrack updatedRacetrack = racetrackRepository.findOne(racetrack.getId());
        updatedRacetrack
                .name(UPDATED_NAME)
                .location(UPDATED_LOCATION)
                .logo(UPDATED_LOGO)
                .logoContentType(UPDATED_LOGO_CONTENT_TYPE);

        restRacetrackMockMvc.perform(put("/api/racetracks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedRacetrack)))
            .andExpect(status().isOk());

        // Validate the Racetrack in the database
        List<Racetrack> racetrackList = racetrackRepository.findAll();
        assertThat(racetrackList).hasSize(databaseSizeBeforeUpdate);
        Racetrack testRacetrack = racetrackList.get(racetrackList.size() - 1);
        assertThat(testRacetrack.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRacetrack.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testRacetrack.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testRacetrack.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);

        // Validate the Racetrack in Elasticsearch
        Racetrack racetrackEs = racetrackSearchRepository.findOne(testRacetrack.getId());
        assertThat(racetrackEs).isEqualToComparingFieldByField(testRacetrack);
    }

    @Test
    @Transactional
    public void updateNonExistingRacetrack() throws Exception {
        int databaseSizeBeforeUpdate = racetrackRepository.findAll().size();

        // Create the Racetrack

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restRacetrackMockMvc.perform(put("/api/racetracks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(racetrack)))
            .andExpect(status().isCreated());

        // Validate the Racetrack in the database
        List<Racetrack> racetrackList = racetrackRepository.findAll();
        assertThat(racetrackList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteRacetrack() throws Exception {
        // Initialize the database
        racetrackRepository.saveAndFlush(racetrack);
        racetrackSearchRepository.save(racetrack);
        int databaseSizeBeforeDelete = racetrackRepository.findAll().size();

        // Get the racetrack
        restRacetrackMockMvc.perform(delete("/api/racetracks/{id}", racetrack.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean racetrackExistsInEs = racetrackSearchRepository.exists(racetrack.getId());
        assertThat(racetrackExistsInEs).isFalse();

        // Validate the database is empty
        List<Racetrack> racetrackList = racetrackRepository.findAll();
        assertThat(racetrackList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchRacetrack() throws Exception {
        // Initialize the database
        racetrackRepository.saveAndFlush(racetrack);
        racetrackSearchRepository.save(racetrack);

        // Search the racetrack
        restRacetrackMockMvc.perform(get("/api/_search/racetracks?query=id:" + racetrack.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(racetrack.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION.toString())))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Racetrack.class);
    }
}
