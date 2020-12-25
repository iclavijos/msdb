package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, UserSubscriptionPK> {

    List<UserSubscription> findAllBySeriesEdition(List<SeriesEdition> series);

}
