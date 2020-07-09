package com.icesoft.msdb.domain;

import javax.persistence.*;
import java.io.Serializable;

@Entity(name = "USER_SUSCRIPTION")
public class UserSubscription implements Serializable {

    @EmbeddedId
    private UserSubscriptionPK id;

    @ManyToOne
    @MapsId("user_id")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("series_edition_id")
    @JoinColumn(name = "series_edition_id")
    private SeriesEdition seriesEdition;

    @Column(name = "practice_sessions")
    private Boolean practiceSessions = Boolean.FALSE;
    @Column(name = "quali_sessions")
    private Boolean qualiSessions = Boolean.FALSE;
    @Column(name = "races")
    private Boolean races = Boolean.FALSE;

    @Column(name = "15m_warning")
    private Boolean fifteenMinWarning = Boolean.FALSE;
    @Column(name = "1h_warning")
    private Boolean OneHourWarning = Boolean.FALSE;
    @Column(name = "3h_warning")
    private Boolean ThreeHoursWarning = Boolean.FALSE;

    public UserSubscriptionPK getId() {
        return id;
    }

    public void setId(UserSubscriptionPK id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SeriesEdition getSeriesEdition() {
        return seriesEdition;
    }

    public void setSeriesEdition(SeriesEdition seriesEdition) {
        this.seriesEdition = seriesEdition;
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

    public Boolean getFifteenMinWarning() {
        return fifteenMinWarning;
    }

    public void setFifteenMinWarning(Boolean fifteenMinWarning) {
        this.fifteenMinWarning = fifteenMinWarning;
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

}
