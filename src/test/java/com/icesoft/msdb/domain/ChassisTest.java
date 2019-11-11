package com.icesoft.msdb.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.icesoft.msdb.web.rest.TestUtil;

public class ChassisTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Chassis.class);
        Chassis chassis1 = new Chassis();
        chassis1.setId(1L);
        Chassis chassis2 = new Chassis();
        chassis2.setId(chassis1.getId());
        assertThat(chassis1).isEqualTo(chassis2);
        chassis2.setId(2L);
        assertThat(chassis1).isNotEqualTo(chassis2);
        chassis1.setId(null);
        assertThat(chassis1).isNotEqualTo(chassis2);
    }
}
