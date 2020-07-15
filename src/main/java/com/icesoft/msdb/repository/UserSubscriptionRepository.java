package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.PointsSystemSession;
import com.icesoft.msdb.domain.PointsSystemSessionPK;
import com.icesoft.msdb.domain.UserSubscription;
import com.icesoft.msdb.domain.UserSubscriptionPK;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, UserSubscriptionPK> {

}
