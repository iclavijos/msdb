package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.UserSubscription;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.BeanUtils;

@Data
@NoArgsConstructor
public class UserSubscriptionDTO {
    private Long seriesEditionId;
    private Boolean practiceSessions = Boolean.FALSE;
    private Boolean qualiSessions = Boolean.FALSE;
    private Boolean races = Boolean.TRUE;
    private Boolean fifteenMinWarning = Boolean.FALSE;
    private Boolean OneHourWarning = Boolean.TRUE;
    private Boolean ThreeHoursWarning = Boolean.FALSE;

    public UserSubscriptionDTO(UserSubscription userSubscription) {
        this.seriesEditionId = userSubscription.getSeriesEdition().getId();
        BeanUtils.copyProperties(userSubscription, this);
    }
}
