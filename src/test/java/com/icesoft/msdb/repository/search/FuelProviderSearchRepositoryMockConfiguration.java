package com.icesoft.msdb.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link FuelProviderSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class FuelProviderSearchRepositoryMockConfiguration {

    @MockBean
    private FuelProviderSearchRepository mockFuelProviderSearchRepository;

}
