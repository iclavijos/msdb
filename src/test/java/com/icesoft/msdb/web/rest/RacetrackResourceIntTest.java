package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MotorsportsDatabaseApp;

import com.icesoft.msdb.domain.Racetrack;
import com.icesoft.msdb.repository.RacetrackRepository;
import com.icesoft.msdb.repository.search.RacetrackSearchRepository;
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
import org.springframework.util.Base64Utils;
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
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LOGO_CONTENT_TYPE = "image/png";

    @Autowired
    private RacetrackRepository racetrackRepository;

    /**
     * This repository is mocked in the com.icesoft.msdb.repository.search test package.
     *
     * @see com.icesoft.msdb.repository.search.RacetrackSearchRepositoryMockConfiguration
     */
    @Autowired
    private RacetrackSearchRepository mockRacetrackSearchRepository;

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

    private MockMvc restRacetrackMockMvc;

    private Racetrack racetrack;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final RacetrackResource racetrackResource = new RacetrackResource(racetrackRepository, mockRacetrackSearchRepository);
        this.restRacetrackMockMvc = MockMvcBuilders.standaloneSetup(racetrackResource)
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
        verify(mockRacetrackSearchRepository, times(1)).save(testRacetrack);
    }

    @Test
    @Transactional
    public void createRacetrackWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = racetrackRepository.findAll().size();

        // Create the Racetrack with an existing ID
        racetrack.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRacetrackMockMvc.perform(post("/api/racetracks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(racetrack)))
            .andExpect(status().isBadRequest());

        // Validate the Racetrack in the database
        List<Racetrack> racetrackList = racetrackRepository.findAll();
        assertThat(racetrackList).hasSize(databaseSizeBeforeCreate);

        // Validate the Racetrack in Elasticsearch
        verify(mockRacetrackSearchRepository, times(0)).save(racetrack);
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

        int databaseSizeBeforeUpdate = racetrackRepository.findAll().size();

        // Update the racetrack
        Racetrack updatedRacetrack = racetrackRepository.findById(racetrack.getId()).get();
        // Disconnect from session so that the updates on updatedRacetrack are not directly saved in db
        em.detach(updatedRacetrack);
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
        verify(mockRacetrackSearchRepository, times(1)).save(testRacetrack);
    }

    @Test
    @Transactional
    public void updateNonExistingRacetrack() throws Exception {
        int databaseSizeBeforeUpdate = racetrackRepository.findAll().size();

        // Create the Racetrack

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRacetrackMockMvc.perform(put("/api/racetracks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(racetrack)))
            .andExpect(status().isBadRequest());

        // Validate the Racetrack in the database
        List<Racetrack> racetrackList = racetrackRepository.findAll();
        assertThat(racetrackList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Racetrack in Elasticsearch
        verify(mockRacetrackSearchRepository, times(0)).save(racetrack);
    }

    @Test
    @Transactional
    public void deleteRacetrack() throws Exception {
        // Initialize the database
        racetrackRepository.saveAndFlush(racetrack);

        int databaseSizeBeforeDelete = racetrackRepository.findAll().size();

        // Delete the racetrack
        restRacetrackMockMvc.perform(delete("/api/racetracks/{id}", racetrack.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Racetrack> racetrackList = racetrackRepository.findAll();
        assertThat(racetrackList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Racetrack in Elasticsearch
        verify(mockRacetrackSearchRepository, times(1)).deleteById(racetrack.getId());
    }

    @Test
    @Transactional
    public void searchRacetrack() throws Exception {
        // Initialize the database
        racetrackRepository.saveAndFlush(racetrack);
        when(mockRacetrackSearchRepository.search(queryStringQuery("id:" + racetrack.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(racetrack), PageRequest.of(0, 1), 1));
        // Search the racetrack
        restRacetrackMockMvc.perform(get("/api/_search/racetracks?query=id:" + racetrack.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(racetrack.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Racetrack.class);
        Racetrack racetrack1 = new Racetrack();
        racetrack1.setId(1L);
        Racetrack racetrack2 = new Racetrack();
        racetrack2.setId(racetrack1.getId());
        assertThat(racetrack1).isEqualTo(racetrack2);
        racetrack2.setId(2L);
        assertThat(racetrack1).isNotEqualTo(racetrack2);
        racetrack1.setId(null);
        assertThat(racetrack1).isNotEqualTo(racetrack2);
    }
}
