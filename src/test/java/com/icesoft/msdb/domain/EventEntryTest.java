package com.icesoft.msdb.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.icesoft.msdb.web.rest.TestUtil;

public class EventEntryTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventEntry.class);
        EventEntry eventEntry1 = new EventEntry();
        eventEntry1.setId(1L);
        EventEntry eventEntry2 = new EventEntry();
        eventEntry2.setId(eventEntry1.getId());
        assertThat(eventEntry1).isEqualTo(eventEntry2);
        eventEntry2.setId(2L);
        assertThat(eventEntry1).isNotEqualTo(eventEntry2);
        eventEntry1.setId(null);
        assertThat(eventEntry1).isNotEqualTo(eventEntry2);
    }
}
