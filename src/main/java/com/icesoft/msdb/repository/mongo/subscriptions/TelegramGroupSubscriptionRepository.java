package com.icesoft.msdb.repository.mongo.subscriptions;

import com.icesoft.msdb.domain.subscriptions.TelegramGroupSubscription;
import com.icesoft.msdb.domain.subscriptions.TelegramGroupSubscriptionKey;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TelegramGroupSubscriptionRepository extends MongoRepository<TelegramGroupSubscription, TelegramGroupSubscriptionKey> {

    @Query(value = "{ '_id.seriesId' : {'$in' : ?0 } }")
    List<TelegramGroupSubscription> findAllByIdSeriesId(List<Long> seriesIds);

}
