package com.icesoft.msdb.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.icesoft.msdb.web.rest.TestUtil;

public class FuelProviderTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FuelProvider.class);
        FuelProvider fuelProvider1 = new FuelProvider();
        fuelProvider1.setId(1L);
        FuelProvider fuelProvider2 = new FuelProvider();
        fuelProvider2.setId(fuelProvider1.getId());
        assertThat(fuelProvider1).isEqualTo(fuelProvider2);
        fuelProvider2.setId(2L);
        assertThat(fuelProvider1).isNotEqualTo(fuelProvider2);
        fuelProvider1.setId(null);
        assertThat(fuelProvider1).isNotEqualTo(fuelProvider2);
    }
}
