package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MotorsportsDatabaseApp;
import com.icesoft.msdb.domain.DriverPointsDetails;
import com.icesoft.msdb.repository.DriverPointsDetailsRepository;
import com.icesoft.msdb.repository.search.DriverPointsDetailsSearchRepository;
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
 * Integration tests for the {@link DriverPointsDetailsResource} REST controller.
 */
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class DriverPointsDetailsResourceIT {

    @Autowired
    private DriverPointsDetailsRepository driverPointsDetailsRepository;

    /**
     * This repository is mocked in the com.icesoft.msdb.repository.search test package.
     *
     * @see com.icesoft.msdb.repository.search.DriverPointsDetailsSearchRepositoryMockConfiguration
     */
    @Autowired
    private DriverPointsDetailsSearchRepository mockDriverPointsDetailsSearchRepository;

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

    private MockMvc restDriverPointsDetailsMockMvc;

    private DriverPointsDetails driverPointsDetails;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DriverPointsDetailsResource driverPointsDetailsResource = new DriverPointsDetailsResource(driverPointsDetailsRepository, mockDriverPointsDetailsSearchRepository);
        this.restDriverPointsDetailsMockMvc = MockMvcBuilders.standaloneSetup(driverPointsDetailsResource)
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
    public static DriverPointsDetails createEntity(EntityManager em) {
        DriverPointsDetails driverPointsDetails = new DriverPointsDetails();
        return driverPointsDetails;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DriverPointsDetails createUpdatedEntity(EntityManager em) {
        DriverPointsDetails driverPointsDetails = new DriverPointsDetails();
        return driverPointsDetails;
    }

    @BeforeEach
    public void initTest() {
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
        verify(mockDriverPointsDetailsSearchRepository, times(1)).save(testDriverPointsDetails);
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

        // Validate the DriverPointsDetails in the database
        List<DriverPointsDetails> driverPointsDetailsList = driverPointsDetailsRepository.findAll();
        assertThat(driverPointsDetailsList).hasSize(databaseSizeBeforeCreate);

        // Validate the DriverPointsDetails in Elasticsearch
        verify(mockDriverPointsDetailsSearchRepository, times(0)).save(driverPointsDetails);
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

        int databaseSizeBeforeUpdate = driverPointsDetailsRepository.findAll().size();

        // Update the driverPointsDetails
        DriverPointsDetails updatedDriverPointsDetails = driverPointsDetailsRepository.findById(driverPointsDetails.getId()).get();
        // Disconnect from session so that the updates on updatedDriverPointsDetails are not directly saved in db
        em.detach(updatedDriverPointsDetails);

        restDriverPointsDetailsMockMvc.perform(put("/api/driver-points-details")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDriverPointsDetails)))
            .andExpect(status().isOk());

        // Validate the DriverPointsDetails in the database
        List<DriverPointsDetails> driverPointsDetailsList = driverPointsDetailsRepository.findAll();
        assertThat(driverPointsDetailsList).hasSize(databaseSizeBeforeUpdate);
        DriverPointsDetails testDriverPointsDetails = driverPointsDetailsList.get(driverPointsDetailsList.size() - 1);

        // Validate the DriverPointsDetails in Elasticsearch
        verify(mockDriverPointsDetailsSearchRepository, times(1)).save(testDriverPointsDetails);
    }

    @Test
    @Transactional
    public void updateNonExistingDriverPointsDetails() throws Exception {
        int databaseSizeBeforeUpdate = driverPointsDetailsRepository.findAll().size();

        // Create the DriverPointsDetails

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDriverPointsDetailsMockMvc.perform(put("/api/driver-points-details")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(driverPointsDetails)))
            .andExpect(status().isBadRequest());

        // Validate the DriverPointsDetails in the database
        List<DriverPointsDetails> driverPointsDetailsList = driverPointsDetailsRepository.findAll();
        assertThat(driverPointsDetailsList).hasSize(databaseSizeBeforeUpdate);

        // Validate the DriverPointsDetails in Elasticsearch
        verify(mockDriverPointsDetailsSearchRepository, times(0)).save(driverPointsDetails);
    }

    @Test
    @Transactional
    public void deleteDriverPointsDetails() throws Exception {
        // Initialize the database
        driverPointsDetailsRepository.saveAndFlush(driverPointsDetails);

        int databaseSizeBeforeDelete = driverPointsDetailsRepository.findAll().size();

        // Delete the driverPointsDetails
        restDriverPointsDetailsMockMvc.perform(delete("/api/driver-points-details/{id}", driverPointsDetails.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DriverPointsDetails> driverPointsDetailsList = driverPointsDetailsRepository.findAll();
        assertThat(driverPointsDetailsList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the DriverPointsDetails in Elasticsearch
        verify(mockDriverPointsDetailsSearchRepository, times(1)).deleteById(driverPointsDetails.getId());
    }

    @Test
    @Transactional
    public void searchDriverPointsDetails() throws Exception {
        // Initialize the database
        driverPointsDetailsRepository.saveAndFlush(driverPointsDetails);
        when(mockDriverPointsDetailsSearchRepository.search(queryStringQuery("id:" + driverPointsDetails.getId())))
            .thenReturn(Collections.singletonList(driverPointsDetails));
        // Search the driverPointsDetails
        restDriverPointsDetailsMockMvc.perform(get("/api/_search/driver-points-details?query=id:" + driverPointsDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(driverPointsDetails.getId().intValue())));
    }
}
