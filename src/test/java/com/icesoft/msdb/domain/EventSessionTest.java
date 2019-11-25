package com.icesoft.msdb.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.icesoft.msdb.web.rest.TestUtil;

public class EventSessionTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventSession.class);
        EventSession eventSession1 = new EventSession();
        eventSession1.setId(1L);
        EventSession eventSession2 = new EventSession();
        eventSession2.setId(eventSession1.getId());
        assertThat(eventSession1).isEqualTo(eventSession2);
        eventSession2.setId(2L);
        assertThat(eventSession1).isNotEqualTo(eventSession2);
        eventSession1.setId(null);
        assertThat(eventSession1).isNotEqualTo(eventSession2);
    }
}
