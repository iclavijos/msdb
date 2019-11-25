package com.icesoft.msdb.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.icesoft.msdb.web.rest.TestUtil;

public class EngineTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Engine.class);
        Engine engine1 = new Engine();
        engine1.setId(1L);
        Engine engine2 = new Engine();
        engine2.setId(engine1.getId());
        assertThat(engine1).isEqualTo(engine2);
        engine2.setId(2L);
        assertThat(engine1).isNotEqualTo(engine2);
        engine1.setId(null);
        assertThat(engine1).isNotEqualTo(engine2);
    }
}
