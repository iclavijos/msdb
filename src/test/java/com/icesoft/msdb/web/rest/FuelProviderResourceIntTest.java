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
import org.mockito.Mock;
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
import com.icesoft.msdb.domain.FuelProvider;
import com.icesoft.msdb.repository.FuelProviderRepository;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.web.rest.errors.ExceptionTranslator;

import static com.icesoft.msdb.web.rest.TestUtil.createFormattingConversionService;
/**
 * Test class for the FuelProviderResource REST controller.
 *
 * @see FuelProviderResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class FuelProviderResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(2, "1");

    @Autowired
    private FuelProviderRepository fuelProviderRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restFuelProviderMockMvc;

    private FuelProvider fuelProvider;
    
    @Mock
    private CDNService cdnService;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final FuelProviderResource fuelProviderResource = new FuelProviderResource(fuelProviderRepository, cdnService);
        this.restFuelProviderMockMvc = MockMvcBuilders.standaloneSetup(fuelProviderResource)
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
    public static FuelProvider createEntity(EntityManager em) {
        FuelProvider fuelProvider = new FuelProvider()
            .name(DEFAULT_NAME)
            .logo(DEFAULT_LOGO);
        return fuelProvider;
    }

    @Before
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
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
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
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
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
        FuelProvider updatedFuelProvider = fuelProviderRepository.findOne(fuelProvider.getId());
        updatedFuelProvider
            .name(UPDATED_NAME)
            .logo(UPDATED_LOGO);

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

    }

    @Test
    @Transactional
    public void updateNonExistingFuelProvider() throws Exception {
        int databaseSizeBeforeUpdate = fuelProviderRepository.findAll().size();

        // Create the FuelProvider

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restFuelProviderMockMvc.perform(put("/api/fuel-providers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(fuelProvider)))
            .andExpect(status().isCreated());

        // Validate the FuelProvider in the database
        List<FuelProvider> fuelProviderList = fuelProviderRepository.findAll();
        assertThat(fuelProviderList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteFuelProvider() throws Exception {
        // Initialize the database
        fuelProviderRepository.saveAndFlush(fuelProvider);
        int databaseSizeBeforeDelete = fuelProviderRepository.findAll().size();

        // Get the fuelProvider
        restFuelProviderMockMvc.perform(delete("/api/fuel-providers/{id}", fuelProvider.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<FuelProvider> fuelProviderList = fuelProviderRepository.findAll();
        assertThat(fuelProviderList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchFuelProvider() throws Exception {
        // Initialize the database
        fuelProviderRepository.saveAndFlush(fuelProvider);

        // Search the fuelProvider
        restFuelProviderMockMvc.perform(get("/api/_search/fuel-providers?query=id:" + fuelProvider.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fuelProvider.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FuelProvider.class);
        FuelProvider fuelProvider1 = new FuelProvider();
        fuelProvider1.setId(1L);
        FuelProvider fuelProvider2 = new FuelProvider();
        fuelProvider2.setId(fuelProvider1.getId());
        assertThat(fuelProvider1).isEqualTo(fuelProvider2);
        fuelProvider2.setId(2L);
        assertThat(fuelProvider1).isNotEqualTo(fuelProvider2);
        fuelProvider1.setId(null);
        assertThat(fuelProvider1).isNotEqualTo(fuelProvider2);
    }
}
