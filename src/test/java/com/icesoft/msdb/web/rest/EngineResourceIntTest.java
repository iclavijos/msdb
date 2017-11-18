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
import com.icesoft.msdb.domain.Engine;
import com.icesoft.msdb.repository.EngineRepository;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.search.EngineSearchRepository;
import com.icesoft.msdb.repository.stats.EngineStatisticsRepository;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.web.rest.errors.ExceptionTranslator;

import static com.icesoft.msdb.web.rest.TestUtil.createFormattingConversionService;
/**
 * Test class for the EngineResource REST controller.
 *
 * @see EngineResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
public class EngineResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_MANUFACTURER = "AAAAAAAAAA";
    private static final String UPDATED_MANUFACTURER = "BBBBBBBBBB";

    private static final Integer DEFAULT_CAPACITY = 1;
    private static final Integer UPDATED_CAPACITY = 2;

    private static final String DEFAULT_ARCHITECTURE = "AAAAAAAAAA";
    private static final String UPDATED_ARCHITECTURE = "BBBBBBBBBB";

    private static final Integer DEFAULT_DEBUT_YEAR = 1;
    private static final Integer UPDATED_DEBUT_YEAR = 2;

    private static final Boolean DEFAULT_PETROL_ENGINE = false;
    private static final Boolean UPDATED_PETROL_ENGINE = true;

    private static final Boolean DEFAULT_DIESEL_ENGINE = false;
    private static final Boolean UPDATED_DIESEL_ENGINE = true;

    private static final Boolean DEFAULT_ELECTRIC_ENGINE = false;
    private static final Boolean UPDATED_ELECTRIC_ENGINE = true;

    private static final Boolean DEFAULT_TURBO = false;
    private static final Boolean UPDATED_TURBO = true;

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(2, "1");

    @Autowired
    private EngineRepository engineRepository;
    @Autowired
    private EventEntryRepository eventEntryRepo;
    @Autowired
    private EngineStatisticsRepository engineStatsRepo;
    
    @Autowired
    private EngineSearchRepository engineSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;
    
    @Mock
    private CDNService cdnService;

    private MockMvc restEngineMockMvc;

    private Engine engine;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EngineResource engineResource = new EngineResource(engineRepository, engineSearchRepository, eventEntryRepo, engineStatsRepo, cdnService);
        this.restEngineMockMvc = MockMvcBuilders.standaloneSetup(engineResource)
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
    public static Engine createEntity(EntityManager em) {
        Engine engine = new Engine()
            .name(DEFAULT_NAME)
            .manufacturer(DEFAULT_MANUFACTURER)
            .capacity(DEFAULT_CAPACITY)
            .architecture(DEFAULT_ARCHITECTURE)
            .debutYear(DEFAULT_DEBUT_YEAR)
            .petrolEngine(DEFAULT_PETROL_ENGINE)
            .dieselEngine(DEFAULT_DIESEL_ENGINE)
            .electricEngine(DEFAULT_ELECTRIC_ENGINE)
            .turbo(DEFAULT_TURBO)
            .image(DEFAULT_IMAGE);
        return engine;
    }

    @Before
    public void initTest() {
        engineSearchRepository.deleteAll();
        engine = createEntity(em);
    }

    @Test
    @Transactional
    public void createEngine() throws Exception {
        int databaseSizeBeforeCreate = engineRepository.findAll().size();

        // Create the Engine
        restEngineMockMvc.perform(post("/api/engines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(engine)))
            .andExpect(status().isCreated());

        // Validate the Engine in the database
        List<Engine> engineList = engineRepository.findAll();
        assertThat(engineList).hasSize(databaseSizeBeforeCreate + 1);
        Engine testEngine = engineList.get(engineList.size() - 1);
        assertThat(testEngine.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEngine.getManufacturer()).isEqualTo(DEFAULT_MANUFACTURER);
        assertThat(testEngine.getCapacity()).isEqualTo(DEFAULT_CAPACITY);
        assertThat(testEngine.getArchitecture()).isEqualTo(DEFAULT_ARCHITECTURE);
        assertThat(testEngine.getDebutYear()).isEqualTo(DEFAULT_DEBUT_YEAR);
        assertThat(testEngine.isPetrolEngine()).isEqualTo(DEFAULT_PETROL_ENGINE);
        assertThat(testEngine.isDieselEngine()).isEqualTo(DEFAULT_DIESEL_ENGINE);
        assertThat(testEngine.isElectricEngine()).isEqualTo(DEFAULT_ELECTRIC_ENGINE);
        assertThat(testEngine.isTurbo()).isEqualTo(DEFAULT_TURBO);
        assertThat(testEngine.getImage()).isEqualTo(DEFAULT_IMAGE);

        // Validate the Engine in Elasticsearch
        Engine engineEs = engineSearchRepository.findOne(testEngine.getId());
        assertThat(engineEs).isEqualToComparingFieldByField(testEngine);
    }

    @Test
    @Transactional
    public void createEngineWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = engineRepository.findAll().size();

        // Create the Engine with an existing ID
        engine.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEngineMockMvc.perform(post("/api/engines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(engine)))
            .andExpect(status().isBadRequest());

        // Validate the Engine in the database
        List<Engine> engineList = engineRepository.findAll();
        assertThat(engineList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = engineRepository.findAll().size();
        // set the field null
        engine.setName(null);

        // Create the Engine, which fails.

        restEngineMockMvc.perform(post("/api/engines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(engine)))
            .andExpect(status().isBadRequest());

        List<Engine> engineList = engineRepository.findAll();
        assertThat(engineList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkManufacturerIsRequired() throws Exception {
        int databaseSizeBeforeTest = engineRepository.findAll().size();
        // set the field null
        engine.setManufacturer(null);

        // Create the Engine, which fails.

        restEngineMockMvc.perform(post("/api/engines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(engine)))
            .andExpect(status().isBadRequest());

        List<Engine> engineList = engineRepository.findAll();
        assertThat(engineList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCapacityIsRequired() throws Exception {
        int databaseSizeBeforeTest = engineRepository.findAll().size();
        // set the field null
        engine.setCapacity(null);

        // Create the Engine, which fails.

        restEngineMockMvc.perform(post("/api/engines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(engine)))
            .andExpect(status().isBadRequest());

        List<Engine> engineList = engineRepository.findAll();
        assertThat(engineList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkArchitectureIsRequired() throws Exception {
        int databaseSizeBeforeTest = engineRepository.findAll().size();
        // set the field null
        engine.setArchitecture(null);

        // Create the Engine, which fails.

        restEngineMockMvc.perform(post("/api/engines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(engine)))
            .andExpect(status().isBadRequest());

        List<Engine> engineList = engineRepository.findAll();
        assertThat(engineList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDebutYearIsRequired() throws Exception {
        int databaseSizeBeforeTest = engineRepository.findAll().size();
        // set the field null
        engine.setDebutYear(null);

        // Create the Engine, which fails.

        restEngineMockMvc.perform(post("/api/engines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(engine)))
            .andExpect(status().isBadRequest());

        List<Engine> engineList = engineRepository.findAll();
        assertThat(engineList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEngines() throws Exception {
        // Initialize the database
        engineRepository.saveAndFlush(engine);

        // Get all the engineList
        restEngineMockMvc.perform(get("/api/engines?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(engine.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].manufacturer").value(hasItem(DEFAULT_MANUFACTURER.toString())))
            .andExpect(jsonPath("$.[*].capacity").value(hasItem(DEFAULT_CAPACITY)))
            .andExpect(jsonPath("$.[*].architecture").value(hasItem(DEFAULT_ARCHITECTURE.toString())))
            .andExpect(jsonPath("$.[*].debutYear").value(hasItem(DEFAULT_DEBUT_YEAR)))
            .andExpect(jsonPath("$.[*].petrolEngine").value(hasItem(DEFAULT_PETROL_ENGINE.booleanValue())))
            .andExpect(jsonPath("$.[*].dieselEngine").value(hasItem(DEFAULT_DIESEL_ENGINE.booleanValue())))
            .andExpect(jsonPath("$.[*].electricEngine").value(hasItem(DEFAULT_ELECTRIC_ENGINE.booleanValue())))
            .andExpect(jsonPath("$.[*].turbo").value(hasItem(DEFAULT_TURBO.booleanValue())))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    public void getEngine() throws Exception {
        // Initialize the database
        engineRepository.saveAndFlush(engine);

        // Get the engine
        restEngineMockMvc.perform(get("/api/engines/{id}", engine.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(engine.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.manufacturer").value(DEFAULT_MANUFACTURER.toString()))
            .andExpect(jsonPath("$.capacity").value(DEFAULT_CAPACITY))
            .andExpect(jsonPath("$.architecture").value(DEFAULT_ARCHITECTURE.toString()))
            .andExpect(jsonPath("$.debutYear").value(DEFAULT_DEBUT_YEAR))
            .andExpect(jsonPath("$.petrolEngine").value(DEFAULT_PETROL_ENGINE.booleanValue()))
            .andExpect(jsonPath("$.dieselEngine").value(DEFAULT_DIESEL_ENGINE.booleanValue()))
            .andExpect(jsonPath("$.electricEngine").value(DEFAULT_ELECTRIC_ENGINE.booleanValue()))
            .andExpect(jsonPath("$.turbo").value(DEFAULT_TURBO.booleanValue()))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    public void getNonExistingEngine() throws Exception {
        // Get the engine
        restEngineMockMvc.perform(get("/api/engines/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEngine() throws Exception {
        // Initialize the database
        engineRepository.saveAndFlush(engine);
        engineSearchRepository.save(engine);
        int databaseSizeBeforeUpdate = engineRepository.findAll().size();

        // Update the engine
        Engine updatedEngine = engineRepository.findOne(engine.getId());
        updatedEngine
            .name(UPDATED_NAME)
            .manufacturer(UPDATED_MANUFACTURER)
            .capacity(UPDATED_CAPACITY)
            .architecture(UPDATED_ARCHITECTURE)
            .debutYear(UPDATED_DEBUT_YEAR)
            .petrolEngine(UPDATED_PETROL_ENGINE)
            .dieselEngine(UPDATED_DIESEL_ENGINE)
            .electricEngine(UPDATED_ELECTRIC_ENGINE)
            .turbo(UPDATED_TURBO)
            .image(UPDATED_IMAGE);

        restEngineMockMvc.perform(put("/api/engines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEngine)))
            .andExpect(status().isOk());

        // Validate the Engine in the database
        List<Engine> engineList = engineRepository.findAll();
        assertThat(engineList).hasSize(databaseSizeBeforeUpdate);
        Engine testEngine = engineList.get(engineList.size() - 1);
        assertThat(testEngine.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEngine.getManufacturer()).isEqualTo(UPDATED_MANUFACTURER);
        assertThat(testEngine.getCapacity()).isEqualTo(UPDATED_CAPACITY);
        assertThat(testEngine.getArchitecture()).isEqualTo(UPDATED_ARCHITECTURE);
        assertThat(testEngine.getDebutYear()).isEqualTo(UPDATED_DEBUT_YEAR);
        assertThat(testEngine.isPetrolEngine()).isEqualTo(UPDATED_PETROL_ENGINE);
        assertThat(testEngine.isDieselEngine()).isEqualTo(UPDATED_DIESEL_ENGINE);
        assertThat(testEngine.isElectricEngine()).isEqualTo(UPDATED_ELECTRIC_ENGINE);
        assertThat(testEngine.isTurbo()).isEqualTo(UPDATED_TURBO);
        assertThat(testEngine.getImage()).isEqualTo(UPDATED_IMAGE);

        // Validate the Engine in Elasticsearch
        Engine engineEs = engineSearchRepository.findOne(testEngine.getId());
        assertThat(engineEs).isEqualToComparingFieldByField(testEngine);
    }

    @Test
    @Transactional
    public void updateNonExistingEngine() throws Exception {
        int databaseSizeBeforeUpdate = engineRepository.findAll().size();

        // Create the Engine

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restEngineMockMvc.perform(put("/api/engines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(engine)))
            .andExpect(status().isCreated());

        // Validate the Engine in the database
        List<Engine> engineList = engineRepository.findAll();
        assertThat(engineList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteEngine() throws Exception {
        // Initialize the database
        engineRepository.saveAndFlush(engine);
        engineSearchRepository.save(engine);
        int databaseSizeBeforeDelete = engineRepository.findAll().size();

        // Get the engine
        restEngineMockMvc.perform(delete("/api/engines/{id}", engine.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean engineExistsInEs = engineSearchRepository.exists(engine.getId());
        assertThat(engineExistsInEs).isFalse();

        // Validate the database is empty
        List<Engine> engineList = engineRepository.findAll();
        assertThat(engineList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchEngine() throws Exception {
        // Initialize the database
        engineRepository.saveAndFlush(engine);
        engineSearchRepository.save(engine);

        // Search the engine
        restEngineMockMvc.perform(get("/api/_search/engines?query=id:" + engine.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(engine.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].manufacturer").value(hasItem(DEFAULT_MANUFACTURER.toString())))
            .andExpect(jsonPath("$.[*].capacity").value(hasItem(DEFAULT_CAPACITY)))
            .andExpect(jsonPath("$.[*].architecture").value(hasItem(DEFAULT_ARCHITECTURE.toString())))
            .andExpect(jsonPath("$.[*].debutYear").value(hasItem(DEFAULT_DEBUT_YEAR)))
            .andExpect(jsonPath("$.[*].petrolEngine").value(hasItem(DEFAULT_PETROL_ENGINE.booleanValue())))
            .andExpect(jsonPath("$.[*].dieselEngine").value(hasItem(DEFAULT_DIESEL_ENGINE.booleanValue())))
            .andExpect(jsonPath("$.[*].electricEngine").value(hasItem(DEFAULT_ELECTRIC_ENGINE.booleanValue())))
            .andExpect(jsonPath("$.[*].turbo").value(hasItem(DEFAULT_TURBO.booleanValue())))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Engine.class);
        Engine engine1 = new Engine();
        engine1.setId(1L);
        Engine engine2 = new Engine();
        engine2.setId(engine1.getId());
        assertThat(engine1).isEqualTo(engine2);
        engine2.setId(2L);
        assertThat(engine1).isNotEqualTo(engine2);
        engine1.setId(null);
        assertThat(engine1).isNotEqualTo(engine2);
    }
}
