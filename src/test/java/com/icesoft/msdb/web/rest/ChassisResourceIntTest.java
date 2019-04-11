package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MotorsportsDatabaseApp;

import com.icesoft.msdb.domain.Chassis;
import com.icesoft.msdb.repository.ChassisRepository;
import com.icesoft.msdb.repository.search.ChassisSearchRepository;
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
 * Test class for the ChassisResource REST controller.
 *
 * @see ChassisResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class ChassisResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_MANUFACTURER = "AAAAAAAAAA";
    private static final String UPDATED_MANUFACTURER = "BBBBBBBBBB";

    private static final Integer DEFAULT_DEBUT_YEAR = 1;
    private static final Integer UPDATED_DEBUT_YEAR = 2;

    @Autowired
    private ChassisRepository chassisRepository;

    /**
     * This repository is mocked in the com.icesoft.msdb.repository.search test package.
     *
     * @see com.icesoft.msdb.repository.search.ChassisSearchRepositoryMockConfiguration
     */
    @Autowired
    private ChassisSearchRepository mockChassisSearchRepository;

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

    private MockMvc restChassisMockMvc;

    private Chassis chassis;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ChassisResource chassisResource = new ChassisResource(chassisRepository, mockChassisSearchRepository);
        this.restChassisMockMvc = MockMvcBuilders.standaloneSetup(chassisResource)
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
    public static Chassis createEntity(EntityManager em) {
        Chassis chassis = new Chassis()
            .name(DEFAULT_NAME)
            .manufacturer(DEFAULT_MANUFACTURER)
            .debutYear(DEFAULT_DEBUT_YEAR);
        return chassis;
    }

    @Before
    public void initTest() {
        chassis = createEntity(em);
    }

    @Test
    @Transactional
    public void createChassis() throws Exception {
        int databaseSizeBeforeCreate = chassisRepository.findAll().size();

        // Create the Chassis
        restChassisMockMvc.perform(post("/api/chassis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(chassis)))
            .andExpect(status().isCreated());

        // Validate the Chassis in the database
        List<Chassis> chassisList = chassisRepository.findAll();
        assertThat(chassisList).hasSize(databaseSizeBeforeCreate + 1);
        Chassis testChassis = chassisList.get(chassisList.size() - 1);
        assertThat(testChassis.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testChassis.getManufacturer()).isEqualTo(DEFAULT_MANUFACTURER);
        assertThat(testChassis.getDebutYear()).isEqualTo(DEFAULT_DEBUT_YEAR);

        // Validate the Chassis in Elasticsearch
        verify(mockChassisSearchRepository, times(1)).save(testChassis);
    }

    @Test
    @Transactional
    public void createChassisWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = chassisRepository.findAll().size();

        // Create the Chassis with an existing ID
        chassis.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restChassisMockMvc.perform(post("/api/chassis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(chassis)))
            .andExpect(status().isBadRequest());

        // Validate the Chassis in the database
        List<Chassis> chassisList = chassisRepository.findAll();
        assertThat(chassisList).hasSize(databaseSizeBeforeCreate);

        // Validate the Chassis in Elasticsearch
        verify(mockChassisSearchRepository, times(0)).save(chassis);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = chassisRepository.findAll().size();
        // set the field null
        chassis.setName(null);

        // Create the Chassis, which fails.

        restChassisMockMvc.perform(post("/api/chassis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(chassis)))
            .andExpect(status().isBadRequest());

        List<Chassis> chassisList = chassisRepository.findAll();
        assertThat(chassisList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkManufacturerIsRequired() throws Exception {
        int databaseSizeBeforeTest = chassisRepository.findAll().size();
        // set the field null
        chassis.setManufacturer(null);

        // Create the Chassis, which fails.

        restChassisMockMvc.perform(post("/api/chassis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(chassis)))
            .andExpect(status().isBadRequest());

        List<Chassis> chassisList = chassisRepository.findAll();
        assertThat(chassisList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDebutYearIsRequired() throws Exception {
        int databaseSizeBeforeTest = chassisRepository.findAll().size();
        // set the field null
        chassis.setDebutYear(null);

        // Create the Chassis, which fails.

        restChassisMockMvc.perform(post("/api/chassis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(chassis)))
            .andExpect(status().isBadRequest());

        List<Chassis> chassisList = chassisRepository.findAll();
        assertThat(chassisList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllChassis() throws Exception {
        // Initialize the database
        chassisRepository.saveAndFlush(chassis);

        // Get all the chassisList
        restChassisMockMvc.perform(get("/api/chassis?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chassis.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].manufacturer").value(hasItem(DEFAULT_MANUFACTURER.toString())))
            .andExpect(jsonPath("$.[*].debutYear").value(hasItem(DEFAULT_DEBUT_YEAR)));
    }
    
    @Test
    @Transactional
    public void getChassis() throws Exception {
        // Initialize the database
        chassisRepository.saveAndFlush(chassis);

        // Get the chassis
        restChassisMockMvc.perform(get("/api/chassis/{id}", chassis.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(chassis.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.manufacturer").value(DEFAULT_MANUFACTURER.toString()))
            .andExpect(jsonPath("$.debutYear").value(DEFAULT_DEBUT_YEAR));
    }

    @Test
    @Transactional
    public void getNonExistingChassis() throws Exception {
        // Get the chassis
        restChassisMockMvc.perform(get("/api/chassis/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateChassis() throws Exception {
        // Initialize the database
        chassisRepository.saveAndFlush(chassis);

        int databaseSizeBeforeUpdate = chassisRepository.findAll().size();

        // Update the chassis
        Chassis updatedChassis = chassisRepository.findById(chassis.getId()).get();
        // Disconnect from session so that the updates on updatedChassis are not directly saved in db
        em.detach(updatedChassis);
        updatedChassis
            .name(UPDATED_NAME)
            .manufacturer(UPDATED_MANUFACTURER)
            .debutYear(UPDATED_DEBUT_YEAR);

        restChassisMockMvc.perform(put("/api/chassis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedChassis)))
            .andExpect(status().isOk());

        // Validate the Chassis in the database
        List<Chassis> chassisList = chassisRepository.findAll();
        assertThat(chassisList).hasSize(databaseSizeBeforeUpdate);
        Chassis testChassis = chassisList.get(chassisList.size() - 1);
        assertThat(testChassis.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testChassis.getManufacturer()).isEqualTo(UPDATED_MANUFACTURER);
        assertThat(testChassis.getDebutYear()).isEqualTo(UPDATED_DEBUT_YEAR);

        // Validate the Chassis in Elasticsearch
        verify(mockChassisSearchRepository, times(1)).save(testChassis);
    }

    @Test
    @Transactional
    public void updateNonExistingChassis() throws Exception {
        int databaseSizeBeforeUpdate = chassisRepository.findAll().size();

        // Create the Chassis

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChassisMockMvc.perform(put("/api/chassis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(chassis)))
            .andExpect(status().isBadRequest());

        // Validate the Chassis in the database
        List<Chassis> chassisList = chassisRepository.findAll();
        assertThat(chassisList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Chassis in Elasticsearch
        verify(mockChassisSearchRepository, times(0)).save(chassis);
    }

    @Test
    @Transactional
    public void deleteChassis() throws Exception {
        // Initialize the database
        chassisRepository.saveAndFlush(chassis);

        int databaseSizeBeforeDelete = chassisRepository.findAll().size();

        // Delete the chassis
        restChassisMockMvc.perform(delete("/api/chassis/{id}", chassis.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Chassis> chassisList = chassisRepository.findAll();
        assertThat(chassisList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Chassis in Elasticsearch
        verify(mockChassisSearchRepository, times(1)).deleteById(chassis.getId());
    }

    @Test
    @Transactional
    public void searchChassis() throws Exception {
        // Initialize the database
        chassisRepository.saveAndFlush(chassis);
        when(mockChassisSearchRepository.search(queryStringQuery("id:" + chassis.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(chassis), PageRequest.of(0, 1), 1));
        // Search the chassis
        restChassisMockMvc.perform(get("/api/_search/chassis?query=id:" + chassis.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chassis.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].manufacturer").value(hasItem(DEFAULT_MANUFACTURER)))
            .andExpect(jsonPath("$.[*].debutYear").value(hasItem(DEFAULT_DEBUT_YEAR)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Chassis.class);
        Chassis chassis1 = new Chassis();
        chassis1.setId(1L);
        Chassis chassis2 = new Chassis();
        chassis2.setId(chassis1.getId());
        assertThat(chassis1).isEqualTo(chassis2);
        chassis2.setId(2L);
        assertThat(chassis1).isNotEqualTo(chassis2);
        chassis1.setId(null);
        assertThat(chassis1).isNotEqualTo(chassis2);
    }
}
