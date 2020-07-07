package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.UserSubscription;
import org.springframework.beans.BeanUtils;

public class UserSubscriptionDTO {
    private Long seriesEditionId;
    private Boolean practiceSessions = Boolean.FALSE;
    private Boolean qualiSessions = Boolean.FALSE;
    private Boolean races = Boolean.TRUE;
    private Boolean fiveMinWarning = Boolean.FALSE;
    private Boolean fifteenMinWarning = Boolean.FALSE;
    private Boolean thirtyMinWarning = Boolean.FALSE;
    private Boolean OneHourWarning = Boolean.TRUE;
    private Boolean ThreeHoursWarning = Boolean.FALSE;
    private Boolean TwelveHoursWarning = Boolean.FALSE;
    private Boolean OneDayWarning = Boolean.FALSE;

    public UserSubscriptionDTO() {

    }

    public UserSubscriptionDTO(UserSubscription userSubscription) {
        this.seriesEditionId = userSubscription.getSeriesEdition().getId();
        BeanUtils.copyProperties(userSubscription, this);
    }

    public Long getSeriesEditionId() {
        return seriesEditionId;
    }

    public void setSeriesEditionId(Long seriesEditionId) {
        this.seriesEditionId = seriesEditionId;
    }

    public Boolean getPracticeSessions() {
        return practiceSessions;
    }

    public void setPracticeSessions(Boolean practiceSessions) {
        this.practiceSessions = practiceSessions;
    }

    public Boolean getQualiSessions() {
        return qualiSessions;
    }

    public void setQualiSessions(Boolean qualiSessions) {
        this.qualiSessions = qualiSessions;
    }

    public Boolean getRaces() {
        return races;
    }

    public void setRaces(Boolean races) {
        this.races = races;
    }

    public Boolean getFiveMinWarning() {
        return fiveMinWarning;
    }

    public void setFiveMinWarning(Boolean fiveMinWarning) {
        this.fiveMinWarning = fiveMinWarning;
    }

    public Boolean getFifteenMinWarning() {
        return fifteenMinWarning;
    }

    public void setFifteenMinWarning(Boolean fifteenMinWarning) {
        this.fifteenMinWarning = fifteenMinWarning;
    }

    public Boolean getThirtyMinWarning() {
        return thirtyMinWarning;
    }

    public void setThirtyMinWarning(Boolean thirtyMinWarning) {
        this.thirtyMinWarning = thirtyMinWarning;
    }

    public Boolean getOneHourWarning() {
        return OneHourWarning;
    }

    public void setOneHourWarning(Boolean oneHourWarning) {
        OneHourWarning = oneHourWarning;
    }

    public Boolean getThreeHoursWarning() {
        return ThreeHoursWarning;
    }

    public void setThreeHoursWarning(Boolean threeHoursWarning) {
        ThreeHoursWarning = threeHoursWarning;
    }

    public Boolean getTwelveHoursWarning() {
        return TwelveHoursWarning;
    }

    public void setTwelveHoursWarning(Boolean twelveHoursWarning) {
        TwelveHoursWarning = twelveHoursWarning;
    }

    public Boolean getOneDayWarning() {
        return OneDayWarning;
    }

    public void setOneDayWarning(Boolean oneDayWarning) {
        OneDayWarning = oneDayWarning;
    }
}
