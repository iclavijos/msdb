package com.icesoft.msdb.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.icesoft.msdb.web.rest.TestUtil;

public class EventEntryResultTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventEntryResult.class);
        EventEntryResult eventEntryResult1 = new EventEntryResult();
        eventEntryResult1.setId(1L);
        EventEntryResult eventEntryResult2 = new EventEntryResult();
        eventEntryResult2.setId(eventEntryResult1.getId());
        assertThat(eventEntryResult1).isEqualTo(eventEntryResult2);
        eventEntryResult2.setId(2L);
        assertThat(eventEntryResult1).isNotEqualTo(eventEntryResult2);
        eventEntryResult1.setId(null);
        assertThat(eventEntryResult1).isNotEqualTo(eventEntryResult2);
    }
}
