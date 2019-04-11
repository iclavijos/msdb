package com.icesoft.msdb.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of SeriesSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class SeriesSearchRepositoryMockConfiguration {

    @MockBean
    private SeriesSearchRepository mockSeriesSearchRepository;

}
