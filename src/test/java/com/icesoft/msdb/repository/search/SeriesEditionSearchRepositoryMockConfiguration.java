package com.icesoft.msdb.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of SeriesEditionSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class SeriesEditionSearchRepositoryMockConfiguration {

    @MockBean
    private SeriesEditionSearchRepository mockSeriesEditionSearchRepository;

}
