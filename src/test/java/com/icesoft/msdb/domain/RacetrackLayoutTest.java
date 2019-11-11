package com.icesoft.msdb.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.icesoft.msdb.web.rest.TestUtil;

public class RacetrackLayoutTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RacetrackLayout.class);
        RacetrackLayout racetrackLayout1 = new RacetrackLayout();
        racetrackLayout1.setId(1L);
        RacetrackLayout racetrackLayout2 = new RacetrackLayout();
        racetrackLayout2.setId(racetrackLayout1.getId());
        assertThat(racetrackLayout1).isEqualTo(racetrackLayout2);
        racetrackLayout2.setId(2L);
        assertThat(racetrackLayout1).isNotEqualTo(racetrackLayout2);
        racetrackLayout1.setId(null);
        assertThat(racetrackLayout1).isNotEqualTo(racetrackLayout2);
    }
}
