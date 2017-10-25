package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MotorsportsDatabaseApp;

import com.icesoft.msdb.domain.DriverPointsDetails;
import com.icesoft.msdb.repository.DriverPointsDetailsRepository;
import com.icesoft.msdb.repository.search.DriverPointsDetailsSearchRepository;
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
 * Test class for the DriverPointsDetailsResource REST controller.
 *
 * @see DriverPointsDetailsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class DriverPointsDetailsResourceIntTest {

    @Autowired
    private DriverPointsDetailsRepository driverPointsDetailsRepository;

    @Autowired
    private DriverPointsDetailsSearchRepository driverPointsDetailsSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restDriverPointsDetailsMockMvc;

    private DriverPointsDetails driverPointsDetails;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        DriverPointsDetailsResource driverPointsDetailsResource = new DriverPointsDetailsResource(driverPointsDetailsRepository, driverPointsDetailsSearchRepository);
        this.restDriverPointsDetailsMockMvc = MockMvcBuilders.standaloneSetup(driverPointsDetailsResource)
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
    public static DriverPointsDetails createEntity(EntityManager em) {
        DriverPointsDetails driverPointsDetails = new DriverPointsDetails();
        return driverPointsDetails;
    }

    @Before
    public void initTest() {
        driverPointsDetailsSearchRepository.deleteAll();
        driverPointsDetails = createEntity(em);
    }

    @Test
    @Transactional
    public void createDriverPointsDetails() throws Exception {
        int databaseSizeBeforeCreate = driverPointsDetailsRepository.findAll().size();

        // Create the DriverPointsDetails
        restDriverPointsDetailsMockMvc.perform(post("/api/driver-points-details")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(driverPointsDetails)))
            .andExpect(status().isCreated());

        // Validate the DriverPointsDetails in the database
        List<DriverPointsDetails> driverPointsDetailsList = driverPointsDetailsRepository.findAll();
        assertThat(driverPointsDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        DriverPointsDetails testDriverPointsDetails = driverPointsDetailsList.get(driverPointsDetailsList.size() - 1);

        // Validate the DriverPointsDetails in Elasticsearch
        DriverPointsDetails driverPointsDetailsEs = driverPointsDetailsSearchRepository.findOne(testDriverPointsDetails.getId());
        assertThat(driverPointsDetailsEs).isEqualToComparingFieldByField(testDriverPointsDetails);
    }

    @Test
    @Transactional
    public void createDriverPointsDetailsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = driverPointsDetailsRepository.findAll().size();

        // Create the DriverPointsDetails with an existing ID
        driverPointsDetails.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDriverPointsDetailsMockMvc.perform(post("/api/driver-points-details")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(driverPointsDetails)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<DriverPointsDetails> driverPointsDetailsList = driverPointsDetailsRepository.findAll();
        assertThat(driverPointsDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllDriverPointsDetails() throws Exception {
        // Initialize the database
        driverPointsDetailsRepository.saveAndFlush(driverPointsDetails);

        // Get all the driverPointsDetailsList
        restDriverPointsDetailsMockMvc.perform(get("/api/driver-points-details?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(driverPointsDetails.getId().intValue())));
    }

    @Test
    @Transactional
    public void getDriverPointsDetails() throws Exception {
        // Initialize the database
        driverPointsDetailsRepository.saveAndFlush(driverPointsDetails);

        // Get the driverPointsDetails
        restDriverPointsDetailsMockMvc.perform(get("/api/driver-points-details/{id}", driverPointsDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(driverPointsDetails.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingDriverPointsDetails() throws Exception {
        // Get the driverPointsDetails
        restDriverPointsDetailsMockMvc.perform(get("/api/driver-points-details/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDriverPointsDetails() throws Exception {
        // Initialize the database
        driverPointsDetailsRepository.saveAndFlush(driverPointsDetails);
        driverPointsDetailsSearchRepository.save(driverPointsDetails);
        int databaseSizeBeforeUpdate = driverPointsDetailsRepository.findAll().size();

        // Update the driverPointsDetails
        DriverPointsDetails updatedDriverPointsDetails = driverPointsDetailsRepository.findOne(driverPointsDetails.getId());

        restDriverPointsDetailsMockMvc.perform(put("/api/driver-points-details")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDriverPointsDetails)))
            .andExpect(status().isOk());

        // Validate the DriverPointsDetails in the database
        List<DriverPointsDetails> driverPointsDetailsList = driverPointsDetailsRepository.findAll();
        assertThat(driverPointsDetailsList).hasSize(databaseSizeBeforeUpdate);
        DriverPointsDetails testDriverPointsDetails = driverPointsDetailsList.get(driverPointsDetailsList.size() - 1);

        // Validate the DriverPointsDetails in Elasticsearch
        DriverPointsDetails driverPointsDetailsEs = driverPointsDetailsSearchRepository.findOne(testDriverPointsDetails.getId());
        assertThat(driverPointsDetailsEs).isEqualToComparingFieldByField(testDriverPointsDetails);
    }

    @Test
    @Transactional
    public void updateNonExistingDriverPointsDetails() throws Exception {
        int databaseSizeBeforeUpdate = driverPointsDetailsRepository.findAll().size();

        // Create the DriverPointsDetails

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restDriverPointsDetailsMockMvc.perform(put("/api/driver-points-details")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(driverPointsDetails)))
            .andExpect(status().isCreated());

        // Validate the DriverPointsDetails in the database
        List<DriverPointsDetails> driverPointsDetailsList = driverPointsDetailsRepository.findAll();
        assertThat(driverPointsDetailsList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteDriverPointsDetails() throws Exception {
        // Initialize the database
        driverPointsDetailsRepository.saveAndFlush(driverPointsDetails);
        driverPointsDetailsSearchRepository.save(driverPointsDetails);
        int databaseSizeBeforeDelete = driverPointsDetailsRepository.findAll().size();

        // Get the driverPointsDetails
        restDriverPointsDetailsMockMvc.perform(delete("/api/driver-points-details/{id}", driverPointsDetails.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean driverPointsDetailsExistsInEs = driverPointsDetailsSearchRepository.exists(driverPointsDetails.getId());
        assertThat(driverPointsDetailsExistsInEs).isFalse();

        // Validate the database is empty
        List<DriverPointsDetails> driverPointsDetailsList = driverPointsDetailsRepository.findAll();
        assertThat(driverPointsDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchDriverPointsDetails() throws Exception {
        // Initialize the database
        driverPointsDetailsRepository.saveAndFlush(driverPointsDetails);
        driverPointsDetailsSearchRepository.save(driverPointsDetails);

        // Search the driverPointsDetails
        restDriverPointsDetailsMockMvc.perform(get("/api/_search/driver-points-details?query=id:" + driverPointsDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(driverPointsDetails.getId().intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DriverPointsDetails.class);
        DriverPointsDetails driverPointsDetails1 = new DriverPointsDetails();
        driverPointsDetails1.setId(1L);
        DriverPointsDetails driverPointsDetails2 = new DriverPointsDetails();
        driverPointsDetails2.setId(driverPointsDetails1.getId());
        assertThat(driverPointsDetails1).isEqualTo(driverPointsDetails2);
        driverPointsDetails2.setId(2L);
        assertThat(driverPointsDetails1).isNotEqualTo(driverPointsDetails2);
        driverPointsDetails1.setId(null);
        assertThat(driverPointsDetails1).isNotEqualTo(driverPointsDetails2);
    }
}
