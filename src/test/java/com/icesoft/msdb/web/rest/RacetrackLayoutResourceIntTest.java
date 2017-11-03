
package com.icesoft.msdb.web.rest;

import static com.icesoft.msdb.web.rest.TestUtil.createFormattingConversionService;
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
import com.icesoft.msdb.domain.RacetrackLayout;
import com.icesoft.msdb.repository.RacetrackLayoutRepository;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.web.rest.errors.ExceptionTranslator;

/**
 * Test class for the RacetrackLayoutResource REST controller.
 *
 * @see RacetrackLayoutResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class RacetrackLayoutResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_LENGTH = 1;
    private static final Integer UPDATED_LENGTH = 2;

    private static final Integer DEFAULT_YEAR_FIRST_USE = 1;
    private static final Integer UPDATED_YEAR_FIRST_USE = 2;

    private static final byte[] DEFAULT_LAYOUT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LAYOUT_IMAGE = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_LAYOUT_IMAGE_CONTENT_TYPE = "image/jpg";

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    @Autowired
    private RacetrackLayoutRepository racetrackLayoutRepository;

    @Autowired
    private CDNService cdnService;
    
    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restRacetrackLayoutMockMvc;

    private RacetrackLayout racetrackLayout;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final RacetrackLayoutResource racetrackLayoutResource = new RacetrackLayoutResource(racetrackLayoutRepository, cdnService);
        this.restRacetrackLayoutMockMvc = MockMvcBuilders.standaloneSetup(racetrackLayoutResource)
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
    public static RacetrackLayout createEntity(EntityManager em) {
        RacetrackLayout racetrackLayout = new RacetrackLayout()
            .name(DEFAULT_NAME)
            .length(DEFAULT_LENGTH)
            .yearFirstUse(DEFAULT_YEAR_FIRST_USE)
            .layoutImage(DEFAULT_LAYOUT_IMAGE)
            .active(DEFAULT_ACTIVE);
        return racetrackLayout;
    }

    @Before
    public void initTest() {
        racetrackLayout = createEntity(em);
    }

    @Test
    @Transactional
    public void createRacetrackLayout() throws Exception {
        int databaseSizeBeforeCreate = racetrackLayoutRepository.findAll().size();

        // Create the RacetrackLayout
        restRacetrackLayoutMockMvc.perform(post("/api/racetrack-layouts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(racetrackLayout)))
            .andExpect(status().isCreated());

        // Validate the RacetrackLayout in the database
        List<RacetrackLayout> racetrackLayoutList = racetrackLayoutRepository.findAll();
        assertThat(racetrackLayoutList).hasSize(databaseSizeBeforeCreate + 1);
        RacetrackLayout testRacetrackLayout = racetrackLayoutList.get(racetrackLayoutList.size() - 1);
        assertThat(testRacetrackLayout.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testRacetrackLayout.getLength()).isEqualTo(DEFAULT_LENGTH);
        assertThat(testRacetrackLayout.getYearFirstUse()).isEqualTo(DEFAULT_YEAR_FIRST_USE);
        assertThat(testRacetrackLayout.getLayoutImage()).isEqualTo(DEFAULT_LAYOUT_IMAGE);
        assertThat(testRacetrackLayout.isActive()).isEqualTo(DEFAULT_ACTIVE);
    }

    @Test
    @Transactional
    public void createRacetrackLayoutWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = racetrackLayoutRepository.findAll().size();

        // Create the RacetrackLayout with an existing ID
        racetrackLayout.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRacetrackLayoutMockMvc.perform(post("/api/racetrack-layouts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(racetrackLayout)))
            .andExpect(status().isBadRequest());

        // Validate the RacetrackLayout in the database
        List<RacetrackLayout> racetrackLayoutList = racetrackLayoutRepository.findAll();
        assertThat(racetrackLayoutList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = racetrackLayoutRepository.findAll().size();
        // set the field null
        racetrackLayout.setName(null);

        // Create the RacetrackLayout, which fails.

        restRacetrackLayoutMockMvc.perform(post("/api/racetrack-layouts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(racetrackLayout)))
            .andExpect(status().isBadRequest());

        List<RacetrackLayout> racetrackLayoutList = racetrackLayoutRepository.findAll();
        assertThat(racetrackLayoutList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLengthIsRequired() throws Exception {
        int databaseSizeBeforeTest = racetrackLayoutRepository.findAll().size();
        // set the field null
        racetrackLayout.setLength(null);

        // Create the RacetrackLayout, which fails.

        restRacetrackLayoutMockMvc.perform(post("/api/racetrack-layouts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(racetrackLayout)))
            .andExpect(status().isBadRequest());

        List<RacetrackLayout> racetrackLayoutList = racetrackLayoutRepository.findAll();
        assertThat(racetrackLayoutList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkYearFirstUseIsRequired() throws Exception {
        int databaseSizeBeforeTest = racetrackLayoutRepository.findAll().size();
        // set the field null
        racetrackLayout.setYearFirstUse(null);

        // Create the RacetrackLayout, which fails.

        restRacetrackLayoutMockMvc.perform(post("/api/racetrack-layouts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(racetrackLayout)))
            .andExpect(status().isBadRequest());

        List<RacetrackLayout> racetrackLayoutList = racetrackLayoutRepository.findAll();
        assertThat(racetrackLayoutList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllRacetrackLayouts() throws Exception {
        // Initialize the database
        racetrackLayoutRepository.saveAndFlush(racetrackLayout);

        // Get all the racetrackLayoutList
        restRacetrackLayoutMockMvc.perform(get("/api/racetrack-layouts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(racetrackLayout.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].length").value(hasItem(DEFAULT_LENGTH)))
            .andExpect(jsonPath("$.[*].yearFirstUse").value(hasItem(DEFAULT_YEAR_FIRST_USE)))
            .andExpect(jsonPath("$.[*].layoutImageContentType").value(hasItem(DEFAULT_LAYOUT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].layoutImage").value(hasItem(Base64Utils.encodeToString(DEFAULT_LAYOUT_IMAGE))))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())));
    }

    @Test
    @Transactional
    public void getRacetrackLayout() throws Exception {
        // Initialize the database
        racetrackLayoutRepository.saveAndFlush(racetrackLayout);

        // Get the racetrackLayout
        restRacetrackLayoutMockMvc.perform(get("/api/racetrack-layouts/{id}", racetrackLayout.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(racetrackLayout.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.length").value(DEFAULT_LENGTH))
            .andExpect(jsonPath("$.yearFirstUse").value(DEFAULT_YEAR_FIRST_USE))
            .andExpect(jsonPath("$.layoutImageContentType").value(DEFAULT_LAYOUT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.layoutImage").value(Base64Utils.encodeToString(DEFAULT_LAYOUT_IMAGE)))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingRacetrackLayout() throws Exception {
        // Get the racetrackLayout
        restRacetrackLayoutMockMvc.perform(get("/api/racetrack-layouts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRacetrackLayout() throws Exception {
        // Initialize the database
        racetrackLayoutRepository.saveAndFlush(racetrackLayout);
        int databaseSizeBeforeUpdate = racetrackLayoutRepository.findAll().size();

        // Update the racetrackLayout
        RacetrackLayout updatedRacetrackLayout = racetrackLayoutRepository.findOne(racetrackLayout.getId());
        updatedRacetrackLayout
            .name(UPDATED_NAME)
            .length(UPDATED_LENGTH)
            .yearFirstUse(UPDATED_YEAR_FIRST_USE)
            .layoutImage(UPDATED_LAYOUT_IMAGE)
            .active(UPDATED_ACTIVE);

        restRacetrackLayoutMockMvc.perform(put("/api/racetrack-layouts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedRacetrackLayout)))
            .andExpect(status().isOk());

        // Validate the RacetrackLayout in the database
        List<RacetrackLayout> racetrackLayoutList = racetrackLayoutRepository.findAll();
        assertThat(racetrackLayoutList).hasSize(databaseSizeBeforeUpdate);
        RacetrackLayout testRacetrackLayout = racetrackLayoutList.get(racetrackLayoutList.size() - 1);
        assertThat(testRacetrackLayout.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRacetrackLayout.getLength()).isEqualTo(UPDATED_LENGTH);
        assertThat(testRacetrackLayout.getYearFirstUse()).isEqualTo(UPDATED_YEAR_FIRST_USE);
        assertThat(testRacetrackLayout.getLayoutImage()).isEqualTo(UPDATED_LAYOUT_IMAGE);
        assertThat(testRacetrackLayout.isActive()).isEqualTo(UPDATED_ACTIVE);
    }

    @Test
    @Transactional
    public void updateNonExistingRacetrackLayout() throws Exception {
        int databaseSizeBeforeUpdate = racetrackLayoutRepository.findAll().size();

        // Create the RacetrackLayout

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restRacetrackLayoutMockMvc.perform(put("/api/racetrack-layouts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(racetrackLayout)))
            .andExpect(status().isCreated());

        // Validate the RacetrackLayout in the database
        List<RacetrackLayout> racetrackLayoutList = racetrackLayoutRepository.findAll();
        assertThat(racetrackLayoutList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteRacetrackLayout() throws Exception {
        // Initialize the database
        racetrackLayoutRepository.saveAndFlush(racetrackLayout);
        int databaseSizeBeforeDelete = racetrackLayoutRepository.findAll().size();

        // Get the racetrackLayout
        restRacetrackLayoutMockMvc.perform(delete("/api/racetrack-layouts/{id}", racetrackLayout.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<RacetrackLayout> racetrackLayoutList = racetrackLayoutRepository.findAll();
        assertThat(racetrackLayoutList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchRacetrackLayout() throws Exception {
        // Initialize the database
        racetrackLayoutRepository.saveAndFlush(racetrackLayout);

        // Search the racetrackLayout
        restRacetrackLayoutMockMvc.perform(get("/api/_search/racetrack-layouts?query=id:" + racetrackLayout.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(racetrackLayout.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].length").value(hasItem(DEFAULT_LENGTH)))
            .andExpect(jsonPath("$.[*].yearFirstUse").value(hasItem(DEFAULT_YEAR_FIRST_USE)))
            .andExpect(jsonPath("$.[*].layoutImageContentType").value(hasItem(DEFAULT_LAYOUT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].layoutImage").value(hasItem(Base64Utils.encodeToString(DEFAULT_LAYOUT_IMAGE))))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RacetrackLayout.class);
        RacetrackLayout racetrackLayout1 = new RacetrackLayout();
        racetrackLayout1.setId(1L);
        RacetrackLayout racetrackLayout2 = new RacetrackLayout();
        racetrackLayout2.setId(racetrackLayout1.getId());
        assertThat(racetrackLayout1).isEqualTo(racetrackLayout2);
        racetrackLayout2.setId(2L);
        assertThat(racetrackLayout1).isNotEqualTo(racetrackLayout2);
        racetrackLayout1.setId(null);
        assertThat(racetrackLayout1).isNotEqualTo(racetrackLayout2);
    }
}
