package com.icesoft.msdb.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.icesoft.msdb.web.rest.TestUtil;

public class RacetrackTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Racetrack.class);
        Racetrack racetrack1 = new Racetrack();
        racetrack1.setId(1L);
        Racetrack racetrack2 = new Racetrack();
        racetrack2.setId(racetrack1.getId());
        assertThat(racetrack1).isEqualTo(racetrack2);
        racetrack2.setId(2L);
        assertThat(racetrack1).isNotEqualTo(racetrack2);
        racetrack1.setId(null);
        assertThat(racetrack1).isNotEqualTo(racetrack2);
    }
}
