package com.icesoft.msdb.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.icesoft.msdb.web.rest.TestUtil;

public class EventEditionTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventEdition.class);
        EventEdition eventEdition1 = new EventEdition();
        eventEdition1.setId(1L);
        EventEdition eventEdition2 = new EventEdition();
        eventEdition2.setId(eventEdition1.getId());
        assertThat(eventEdition1).isEqualTo(eventEdition2);
        eventEdition2.setId(2L);
        assertThat(eventEdition1).isNotEqualTo(eventEdition2);
        eventEdition1.setId(null);
        assertThat(eventEdition1).isNotEqualTo(eventEdition2);
    }
}
