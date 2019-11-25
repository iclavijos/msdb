package com.icesoft.msdb.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link PointsSystemSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class PointsSystemSearchRepositoryMockConfiguration {

    @MockBean
    private PointsSystemSearchRepository mockPointsSystemSearchRepository;

}
