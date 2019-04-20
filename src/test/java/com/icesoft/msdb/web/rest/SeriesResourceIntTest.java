package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MotorsportsDatabaseApp;

import com.icesoft.msdb.domain.Series;
import com.icesoft.msdb.repository.SeriesRepository;
import com.icesoft.msdb.repository.search.SeriesSearchRepository;
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
 * Test class for the SeriesResource REST controller.
 *
 * @see SeriesResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class SeriesResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_SHORTNAME = "AAAAAAAAAA";
    private static final String UPDATED_SHORTNAME = "BBBBBBBBBB";

    private static final String DEFAULT_ORGANIZER = "AAAAAAAAAA";
    private static final String UPDATED_ORGANIZER = "BBBBBBBBBB";

    private static final byte[] DEFAULT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LOGO_CONTENT_TYPE = "image/png";

    @Autowired
    private SeriesRepository seriesRepository;

    /**
     * This repository is mocked in the com.icesoft.msdb.repository.search test package.
     *
     * @see com.icesoft.msdb.repository.search.SeriesSearchRepositoryMockConfiguration
     */
    @Autowired
    private SeriesSearchRepository mockSeriesSearchRepository;

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

    private MockMvc restSeriesMockMvc;

    private Series series;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SeriesResource seriesResource = new SeriesResource(seriesRepository, mockSeriesSearchRepository);
        this.restSeriesMockMvc = MockMvcBuilders.standaloneSetup(seriesResource)
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
    public static Series createEntity(EntityManager em) {
        Series series = new Series()
            .name(DEFAULT_NAME)
            .shortname(DEFAULT_SHORTNAME)
            .organizer(DEFAULT_ORGANIZER)
            .logo(DEFAULT_LOGO)
            .logoContentType(DEFAULT_LOGO_CONTENT_TYPE);
        return series;
    }

    @Before
    public void initTest() {
        series = createEntity(em);
    }

    @Test
    @Transactional
    public void createSeries() throws Exception {
        int databaseSizeBeforeCreate = seriesRepository.findAll().size();

        // Create the Series
        restSeriesMockMvc.perform(post("/api/series")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(series)))
            .andExpect(status().isCreated());

        // Validate the Series in the database
        List<Series> seriesList = seriesRepository.findAll();
        assertThat(seriesList).hasSize(databaseSizeBeforeCreate + 1);
        Series testSeries = seriesList.get(seriesList.size() - 1);
        assertThat(testSeries.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSeries.getShortname()).isEqualTo(DEFAULT_SHORTNAME);
        assertThat(testSeries.getOrganizer()).isEqualTo(DEFAULT_ORGANIZER);
        assertThat(testSeries.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testSeries.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);

        // Validate the Series in Elasticsearch
        verify(mockSeriesSearchRepository, times(1)).save(testSeries);
    }

    @Test
    @Transactional
    public void createSeriesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = seriesRepository.findAll().size();

        // Create the Series with an existing ID
        series.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSeriesMockMvc.perform(post("/api/series")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(series)))
            .andExpect(status().isBadRequest());

        // Validate the Series in the database
        List<Series> seriesList = seriesRepository.findAll();
        assertThat(seriesList).hasSize(databaseSizeBeforeCreate);

        // Validate the Series in Elasticsearch
        verify(mockSeriesSearchRepository, times(0)).save(series);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = seriesRepository.findAll().size();
        // set the field null
        series.setName(null);

        // Create the Series, which fails.

        restSeriesMockMvc.perform(post("/api/series")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(series)))
            .andExpect(status().isBadRequest());

        List<Series> seriesList = seriesRepository.findAll();
        assertThat(seriesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkShortnameIsRequired() throws Exception {
        int databaseSizeBeforeTest = seriesRepository.findAll().size();
        // set the field null
        series.setShortname(null);

        // Create the Series, which fails.

        restSeriesMockMvc.perform(post("/api/series")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(series)))
            .andExpect(status().isBadRequest());

        List<Series> seriesList = seriesRepository.findAll();
        assertThat(seriesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSeries() throws Exception {
        // Initialize the database
        seriesRepository.saveAndFlush(series);

        // Get all the seriesList
        restSeriesMockMvc.perform(get("/api/series?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(series.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].shortname").value(hasItem(DEFAULT_SHORTNAME.toString())))
            .andExpect(jsonPath("$.[*].organizer").value(hasItem(DEFAULT_ORGANIZER.toString())))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))));
    }
    
    @Test
    @Transactional
    public void getSeries() throws Exception {
        // Initialize the database
        seriesRepository.saveAndFlush(series);

        // Get the series
        restSeriesMockMvc.perform(get("/api/series/{id}", series.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(series.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.shortname").value(DEFAULT_SHORTNAME.toString()))
            .andExpect(jsonPath("$.organizer").value(DEFAULT_ORGANIZER.toString()))
            .andExpect(jsonPath("$.logoContentType").value(DEFAULT_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.logo").value(Base64Utils.encodeToString(DEFAULT_LOGO)));
    }

    @Test
    @Transactional
    public void getNonExistingSeries() throws Exception {
        // Get the series
        restSeriesMockMvc.perform(get("/api/series/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSeries() throws Exception {
        // Initialize the database
        seriesRepository.saveAndFlush(series);

        int databaseSizeBeforeUpdate = seriesRepository.findAll().size();

        // Update the series
        Series updatedSeries = seriesRepository.findById(series.getId()).get();
        // Disconnect from session so that the updates on updatedSeries are not directly saved in db
        em.detach(updatedSeries);
        updatedSeries
            .name(UPDATED_NAME)
            .shortname(UPDATED_SHORTNAME)
            .organizer(UPDATED_ORGANIZER)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE);

        restSeriesMockMvc.perform(put("/api/series")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSeries)))
            .andExpect(status().isOk());

        // Validate the Series in the database
        List<Series> seriesList = seriesRepository.findAll();
        assertThat(seriesList).hasSize(databaseSizeBeforeUpdate);
        Series testSeries = seriesList.get(seriesList.size() - 1);
        assertThat(testSeries.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSeries.getShortname()).isEqualTo(UPDATED_SHORTNAME);
        assertThat(testSeries.getOrganizer()).isEqualTo(UPDATED_ORGANIZER);
        assertThat(testSeries.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testSeries.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);

        // Validate the Series in Elasticsearch
        verify(mockSeriesSearchRepository, times(1)).save(testSeries);
    }

    @Test
    @Transactional
    public void updateNonExistingSeries() throws Exception {
        int databaseSizeBeforeUpdate = seriesRepository.findAll().size();

        // Create the Series

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSeriesMockMvc.perform(put("/api/series")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(series)))
            .andExpect(status().isBadRequest());

        // Validate the Series in the database
        List<Series> seriesList = seriesRepository.findAll();
        assertThat(seriesList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Series in Elasticsearch
        verify(mockSeriesSearchRepository, times(0)).save(series);
    }

    @Test
    @Transactional
    public void deleteSeries() throws Exception {
        // Initialize the database
        seriesRepository.saveAndFlush(series);

        int databaseSizeBeforeDelete = seriesRepository.findAll().size();

        // Delete the series
        restSeriesMockMvc.perform(delete("/api/series/{id}", series.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Series> seriesList = seriesRepository.findAll();
        assertThat(seriesList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Series in Elasticsearch
        verify(mockSeriesSearchRepository, times(1)).deleteById(series.getId());
    }

    @Test
    @Transactional
    public void searchSeries() throws Exception {
        // Initialize the database
        seriesRepository.saveAndFlush(series);
        when(mockSeriesSearchRepository.search(queryStringQuery("id:" + series.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(series), PageRequest.of(0, 1), 1));
        // Search the series
        restSeriesMockMvc.perform(get("/api/_search/series?query=id:" + series.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(series.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].shortname").value(hasItem(DEFAULT_SHORTNAME)))
            .andExpect(jsonPath("$.[*].organizer").value(hasItem(DEFAULT_ORGANIZER)))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Series.class);
        Series series1 = new Series();
        series1.setId(1L);
        Series series2 = new Series();
        series2.setId(series1.getId());
        assertThat(series1).isEqualTo(series2);
        series2.setId(2L);
        assertThat(series1).isNotEqualTo(series2);
        series1.setId(null);
        assertThat(series1).isNotEqualTo(series2);
    }
}
