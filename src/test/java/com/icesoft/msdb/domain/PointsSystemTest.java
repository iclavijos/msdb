package com.icesoft.msdb.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.icesoft.msdb.web.rest.TestUtil;

public class PointsSystemTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PointsSystem.class);
        PointsSystem pointsSystem1 = new PointsSystem();
        pointsSystem1.setId(1L);
        PointsSystem pointsSystem2 = new PointsSystem();
        pointsSystem2.setId(pointsSystem1.getId());
        assertThat(pointsSystem1).isEqualTo(pointsSystem2);
        pointsSystem2.setId(2L);
        assertThat(pointsSystem1).isNotEqualTo(pointsSystem2);
        pointsSystem1.setId(null);
        assertThat(pointsSystem1).isNotEqualTo(pointsSystem2);
    }
}
