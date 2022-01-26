package com.icesoft.msdb.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Data
public class UserSubscriptionPK implements Serializable {

    @Column(name = "user_id")
    private String userId;
    @Column(name = "series_id")
    private Long seriesId;

    public UserSubscriptionPK() {
        super();
    }

    public UserSubscriptionPK(String userId, Long seriesId) {
        this.userId = userId;
        this.seriesId = seriesId;
    }

}
