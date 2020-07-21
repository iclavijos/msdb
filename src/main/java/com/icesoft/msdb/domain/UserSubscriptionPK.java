package com.icesoft.msdb.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserSubscriptionPK implements Serializable {

    @Column(name = "user_id")
    private String userId;
    @Column(name = "series_edition_id")
    private Long seriesEditionId;

    public UserSubscriptionPK() {
        super();
    }

    public UserSubscriptionPK(String userId, Long seriesEditionId) {
        this.userId = userId;
        this.seriesEditionId = seriesEditionId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getSeriesEditionId() {
        return seriesEditionId;
    }

    public void setSeriesEditionId(Long seriesEditionId) {
        this.seriesEditionId = seriesEditionId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserSubscriptionPK that = (UserSubscriptionPK) o;
        return Objects.equals(userId, that.userId) &&
            Objects.equals(seriesEditionId, that.seriesEditionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, seriesEditionId);
    }

    @Override
    public String toString() {
        return "UserSuscriptionPK{" +
            "userId='" + userId + '\'' +
            ", seriesEditionId=" + seriesEditionId +
            '}';
    }
}
