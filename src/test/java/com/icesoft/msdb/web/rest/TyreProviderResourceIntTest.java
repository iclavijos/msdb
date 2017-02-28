package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MotorsportsDatabaseApp;

import com.icesoft.msdb.domain.TyreProvider;
import com.icesoft.msdb.repository.TyreProviderRepository;
import com.icesoft.msdb.repository.search.TyreProviderSearchRepository;
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
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the TyreProviderResource REST controller.
 *
 * @see TyreProviderResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class TyreProviderResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LOGO_CONTENT_TYPE = "image/png";

    @Autowired
    private TyreProviderRepository tyreProviderRepository;

    @Autowired
    private TyreProviderSearchRepository tyreProviderSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restTyreProviderMockMvc;

    private TyreProvider tyreProvider;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            TyreProviderResource tyreProviderResource = new TyreProviderResource(tyreProviderRepository, tyreProviderSearchRepository);
        this.restTyreProviderMockMvc = MockMvcBuilders.standaloneSetup(tyreProviderResource)
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
    public static TyreProvider createEntity(EntityManager em) {
        TyreProvider tyreProvider = new TyreProvider()
                .name(DEFAULT_NAME)
                .logo(DEFAULT_LOGO)
                .logoContentType(DEFAULT_LOGO_CONTENT_TYPE);
        return tyreProvider;
    }

    @Before
    public void initTest() {
        tyreProviderSearchRepository.deleteAll();
        tyreProvider = createEntity(em);
    }

    @Test
    @Transactional
    public void createTyreProvider() throws Exception {
        int databaseSizeBeforeCreate = tyreProviderRepository.findAll().size();

        // Create the TyreProvider

        restTyreProviderMockMvc.perform(post("/api/tyre-providers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tyreProvider)))
            .andExpect(status().isCreated());

        // Validate the TyreProvider in the database
        List<TyreProvider> tyreProviderList = tyreProviderRepository.findAll();
        assertThat(tyreProviderList).hasSize(databaseSizeBeforeCreate + 1);
        TyreProvider testTyreProvider = tyreProviderList.get(tyreProviderList.size() - 1);
        assertThat(testTyreProvider.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTyreProvider.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testTyreProvider.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);

        // Validate the TyreProvider in Elasticsearch
        TyreProvider tyreProviderEs = tyreProviderSearchRepository.findOne(testTyreProvider.getId());
        assertThat(tyreProviderEs).isEqualToComparingFieldByField(testTyreProvider);
    }

    @Test
    @Transactional
    public void createTyreProviderWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = tyreProviderRepository.findAll().size();

        // Create the TyreProvider with an existing ID
        TyreProvider existingTyreProvider = new TyreProvider();
        existingTyreProvider.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTyreProviderMockMvc.perform(post("/api/tyre-providers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingTyreProvider)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<TyreProvider> tyreProviderList = tyreProviderRepository.findAll();
        assertThat(tyreProviderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = tyreProviderRepository.findAll().size();
        // set the field null
        tyreProvider.setName(null);

        // Create the TyreProvider, which fails.

        restTyreProviderMockMvc.perform(post("/api/tyre-providers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tyreProvider)))
            .andExpect(status().isBadRequest());

        List<TyreProvider> tyreProviderList = tyreProviderRepository.findAll();
        assertThat(tyreProviderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTyreProviders() throws Exception {
        // Initialize the database
        tyreProviderRepository.saveAndFlush(tyreProvider);

        // Get all the tyreProviderList
        restTyreProviderMockMvc.perform(get("/api/tyre-providers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tyreProvider.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))));
    }

    @Test
    @Transactional
    public void getTyreProvider() throws Exception {
        // Initialize the database
        tyreProviderRepository.saveAndFlush(tyreProvider);

        // Get the tyreProvider
        restTyreProviderMockMvc.perform(get("/api/tyre-providers/{id}", tyreProvider.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(tyreProvider.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.logoContentType").value(DEFAULT_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.logo").value(Base64Utils.encodeToString(DEFAULT_LOGO)));
    }

    @Test
    @Transactional
    public void getNonExistingTyreProvider() throws Exception {
        // Get the tyreProvider
        restTyreProviderMockMvc.perform(get("/api/tyre-providers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTyreProvider() throws Exception {
        // Initialize the database
        tyreProviderRepository.saveAndFlush(tyreProvider);
        tyreProviderSearchRepository.save(tyreProvider);
        int databaseSizeBeforeUpdate = tyreProviderRepository.findAll().size();

        // Update the tyreProvider
        TyreProvider updatedTyreProvider = tyreProviderRepository.findOne(tyreProvider.getId());
        updatedTyreProvider
                .name(UPDATED_NAME)
                .logo(UPDATED_LOGO)
                .logoContentType(UPDATED_LOGO_CONTENT_TYPE);

        restTyreProviderMockMvc.perform(put("/api/tyre-providers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTyreProvider)))
            .andExpect(status().isOk());

        // Validate the TyreProvider in the database
        List<TyreProvider> tyreProviderList = tyreProviderRepository.findAll();
        assertThat(tyreProviderList).hasSize(databaseSizeBeforeUpdate);
        TyreProvider testTyreProvider = tyreProviderList.get(tyreProviderList.size() - 1);
        assertThat(testTyreProvider.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTyreProvider.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testTyreProvider.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);

        // Validate the TyreProvider in Elasticsearch
        TyreProvider tyreProviderEs = tyreProviderSearchRepository.findOne(testTyreProvider.getId());
        assertThat(tyreProviderEs).isEqualToComparingFieldByField(testTyreProvider);
    }

    @Test
    @Transactional
    public void updateNonExistingTyreProvider() throws Exception {
        int databaseSizeBeforeUpdate = tyreProviderRepository.findAll().size();

        // Create the TyreProvider

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restTyreProviderMockMvc.perform(put("/api/tyre-providers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tyreProvider)))
            .andExpect(status().isCreated());

        // Validate the TyreProvider in the database
        List<TyreProvider> tyreProviderList = tyreProviderRepository.findAll();
        assertThat(tyreProviderList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteTyreProvider() throws Exception {
        // Initialize the database
        tyreProviderRepository.saveAndFlush(tyreProvider);
        tyreProviderSearchRepository.save(tyreProvider);
        int databaseSizeBeforeDelete = tyreProviderRepository.findAll().size();

        // Get the tyreProvider
        restTyreProviderMockMvc.perform(delete("/api/tyre-providers/{id}", tyreProvider.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean tyreProviderExistsInEs = tyreProviderSearchRepository.exists(tyreProvider.getId());
        assertThat(tyreProviderExistsInEs).isFalse();

        // Validate the database is empty
        List<TyreProvider> tyreProviderList = tyreProviderRepository.findAll();
        assertThat(tyreProviderList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchTyreProvider() throws Exception {
        // Initialize the database
        tyreProviderRepository.saveAndFlush(tyreProvider);
        tyreProviderSearchRepository.save(tyreProvider);

        // Search the tyreProvider
        restTyreProviderMockMvc.perform(get("/api/_search/tyre-providers?query=id:" + tyreProvider.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tyreProvider.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TyreProvider.class);
    }
}
