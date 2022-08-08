package com.icesoft.msdb.repository.jpa;

import com.icesoft.msdb.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, UserSubscriptionPK> {

    List<UserSubscription> findAllBySeriesIn(List<Series> series);

}
