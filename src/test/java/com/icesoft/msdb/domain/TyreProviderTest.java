package com.icesoft.msdb.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.icesoft.msdb.web.rest.TestUtil;

public class TyreProviderTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TyreProvider.class);
        TyreProvider tyreProvider1 = new TyreProvider();
        tyreProvider1.setId(1L);
        TyreProvider tyreProvider2 = new TyreProvider();
        tyreProvider2.setId(tyreProvider1.getId());
        assertThat(tyreProvider1).isEqualTo(tyreProvider2);
        tyreProvider2.setId(2L);
        assertThat(tyreProvider1).isNotEqualTo(tyreProvider2);
        tyreProvider1.setId(null);
        assertThat(tyreProvider1).isNotEqualTo(tyreProvider2);
    }
}
