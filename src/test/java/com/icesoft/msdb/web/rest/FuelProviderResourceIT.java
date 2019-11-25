package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MotorsportsDatabaseApp;
import com.icesoft.msdb.domain.FuelProvider;
import com.icesoft.msdb.repository.FuelProviderRepository;
import com.icesoft.msdb.repository.search.FuelProviderSearchRepository;
import com.icesoft.msdb.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
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
 * Integration tests for the {@link FuelProviderResource} REST controller.
 */
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class FuelProviderResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LOGO_CONTENT_TYPE = "image/png";

    @Autowired
    private FuelProviderRepository fuelProviderRepository;

    /**
     * This repository is mocked in the com.icesoft.msdb.repository.search test package.
     *
     * @see com.icesoft.msdb.repository.search.FuelProviderSearchRepositoryMockConfiguration
     */
    @Autowired
    private FuelProviderSearchRepository mockFuelProviderSearchRepository;

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

    private MockMvc restFuelProviderMockMvc;

    private FuelProvider fuelProvider;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final FuelProviderResource fuelProviderResource = new FuelProviderResource(fuelProviderRepository, mockFuelProviderSearchRepository);
        this.restFuelProviderMockMvc = MockMvcBuilders.standaloneSetup(fuelProviderResource)
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
    public static FuelProvider createEntity(EntityManager em) {
        FuelProvider fuelProvider = new FuelProvider()
            .name(DEFAULT_NAME)
            .logo(DEFAULT_LOGO)
            .logoContentType(DEFAULT_LOGO_CONTENT_TYPE);
        return fuelProvider;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FuelProvider createUpdatedEntity(EntityManager em) {
        FuelProvider fuelProvider = new FuelProvider()
            .name(UPDATED_NAME)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE);
        return fuelProvider;
    }

    @BeforeEach
    public void initTest() {
        fuelProvider = createEntity(em);
    }

    @Test
    @Transactional
    public void createFuelProvider() throws Exception {
        int databaseSizeBeforeCreate = fuelProviderRepository.findAll().size();

        // Create the FuelProvider
        restFuelProviderMockMvc.perform(post("/api/fuel-providers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(fuelProvider)))
            .andExpect(status().isCreated());

        // Validate the FuelProvider in the database
        List<FuelProvider> fuelProviderList = fuelProviderRepository.findAll();
        assertThat(fuelProviderList).hasSize(databaseSizeBeforeCreate + 1);
        FuelProvider testFuelProvider = fuelProviderList.get(fuelProviderList.size() - 1);
        assertThat(testFuelProvider.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testFuelProvider.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testFuelProvider.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);

        // Validate the FuelProvider in Elasticsearch
        verify(mockFuelProviderSearchRepository, times(1)).save(testFuelProvider);
    }

    @Test
    @Transactional
    public void createFuelProviderWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = fuelProviderRepository.findAll().size();

        // Create the FuelProvider with an existing ID
        fuelProvider.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFuelProviderMockMvc.perform(post("/api/fuel-providers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(fuelProvider)))
            .andExpect(status().isBadRequest());

        // Validate the FuelProvider in the database
        List<FuelProvider> fuelProviderList = fuelProviderRepository.findAll();
        assertThat(fuelProviderList).hasSize(databaseSizeBeforeCreate);

        // Validate the FuelProvider in Elasticsearch
        verify(mockFuelProviderSearchRepository, times(0)).save(fuelProvider);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = fuelProviderRepository.findAll().size();
        // set the field null
        fuelProvider.setName(null);

        // Create the FuelProvider, which fails.

        restFuelProviderMockMvc.perform(post("/api/fuel-providers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(fuelProvider)))
            .andExpect(status().isBadRequest());

        List<FuelProvider> fuelProviderList = fuelProviderRepository.findAll();
        assertThat(fuelProviderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllFuelProviders() throws Exception {
        // Initialize the database
        fuelProviderRepository.saveAndFlush(fuelProvider);

        // Get all the fuelProviderList
        restFuelProviderMockMvc.perform(get("/api/fuel-providers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fuelProvider.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))));
    }
    
    @Test
    @Transactional
    public void getFuelProvider() throws Exception {
        // Initialize the database
        fuelProviderRepository.saveAndFlush(fuelProvider);

        // Get the fuelProvider
        restFuelProviderMockMvc.perform(get("/api/fuel-providers/{id}", fuelProvider.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(fuelProvider.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.logoContentType").value(DEFAULT_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.logo").value(Base64Utils.encodeToString(DEFAULT_LOGO)));
    }

    @Test
    @Transactional
    public void getNonExistingFuelProvider() throws Exception {
        // Get the fuelProvider
        restFuelProviderMockMvc.perform(get("/api/fuel-providers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFuelProvider() throws Exception {
        // Initialize the database
        fuelProviderRepository.saveAndFlush(fuelProvider);

        int databaseSizeBeforeUpdate = fuelProviderRepository.findAll().size();

        // Update the fuelProvider
        FuelProvider updatedFuelProvider = fuelProviderRepository.findById(fuelProvider.getId()).get();
        // Disconnect from session so that the updates on updatedFuelProvider are not directly saved in db
        em.detach(updatedFuelProvider);
        updatedFuelProvider
            .name(UPDATED_NAME)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE);

        restFuelProviderMockMvc.perform(put("/api/fuel-providers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFuelProvider)))
            .andExpect(status().isOk());

        // Validate the FuelProvider in the database
        List<FuelProvider> fuelProviderList = fuelProviderRepository.findAll();
        assertThat(fuelProviderList).hasSize(databaseSizeBeforeUpdate);
        FuelProvider testFuelProvider = fuelProviderList.get(fuelProviderList.size() - 1);
        assertThat(testFuelProvider.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFuelProvider.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testFuelProvider.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);

        // Validate the FuelProvider in Elasticsearch
        verify(mockFuelProviderSearchRepository, times(1)).save(testFuelProvider);
    }

    @Test
    @Transactional
    public void updateNonExistingFuelProvider() throws Exception {
        int databaseSizeBeforeUpdate = fuelProviderRepository.findAll().size();

        // Create the FuelProvider

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFuelProviderMockMvc.perform(put("/api/fuel-providers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(fuelProvider)))
            .andExpect(status().isBadRequest());

        // Validate the FuelProvider in the database
        List<FuelProvider> fuelProviderList = fuelProviderRepository.findAll();
        assertThat(fuelProviderList).hasSize(databaseSizeBeforeUpdate);

        // Validate the FuelProvider in Elasticsearch
        verify(mockFuelProviderSearchRepository, times(0)).save(fuelProvider);
    }

    @Test
    @Transactional
    public void deleteFuelProvider() throws Exception {
        // Initialize the database
        fuelProviderRepository.saveAndFlush(fuelProvider);

        int databaseSizeBeforeDelete = fuelProviderRepository.findAll().size();

        // Delete the fuelProvider
        restFuelProviderMockMvc.perform(delete("/api/fuel-providers/{id}", fuelProvider.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FuelProvider> fuelProviderList = fuelProviderRepository.findAll();
        assertThat(fuelProviderList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the FuelProvider in Elasticsearch
        verify(mockFuelProviderSearchRepository, times(1)).deleteById(fuelProvider.getId());
    }

    @Test
    @Transactional
    public void searchFuelProvider() throws Exception {
        // Initialize the database
        fuelProviderRepository.saveAndFlush(fuelProvider);
        when(mockFuelProviderSearchRepository.search(queryStringQuery("id:" + fuelProvider.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(fuelProvider), PageRequest.of(0, 1), 1));
        // Search the fuelProvider
        restFuelProviderMockMvc.perform(get("/api/_search/fuel-providers?query=id:" + fuelProvider.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fuelProvider.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))));
    }
}
