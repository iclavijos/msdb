package com.icesoft.msdb.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.icesoft.msdb.web.rest.TestUtil;

public class SeriesEditionTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SeriesEdition.class);
        SeriesEdition seriesEdition1 = new SeriesEdition();
        seriesEdition1.setId(1L);
        SeriesEdition seriesEdition2 = new SeriesEdition();
        seriesEdition2.setId(seriesEdition1.getId());
        assertThat(seriesEdition1).isEqualTo(seriesEdition2);
        seriesEdition2.setId(2L);
        assertThat(seriesEdition1).isNotEqualTo(seriesEdition2);
        seriesEdition1.setId(null);
        assertThat(seriesEdition1).isNotEqualTo(seriesEdition2);
    }
}
