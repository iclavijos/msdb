package com.icesoft.msdb.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.icesoft.msdb.web.rest.TestUtil;

public class DriverPointsDetailsTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DriverPointsDetails.class);
        DriverPointsDetails driverPointsDetails1 = new DriverPointsDetails();
        driverPointsDetails1.setId(1L);
        DriverPointsDetails driverPointsDetails2 = new DriverPointsDetails();
        driverPointsDetails2.setId(driverPointsDetails1.getId());
        assertThat(driverPointsDetails1).isEqualTo(driverPointsDetails2);
        driverPointsDetails2.setId(2L);
        assertThat(driverPointsDetails1).isNotEqualTo(driverPointsDetails2);
        driverPointsDetails1.setId(null);
        assertThat(driverPointsDetails1).isNotEqualTo(driverPointsDetails2);
    }
}
