package com.icesoft.msdb.repository.mongo.subscriptions;

import com.icesoft.msdb.domain.subscriptions.Sessions;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

public interface SessionsRepository extends MongoRepository<Sessions, Long> {

    void deleteByTimestampLessThan(Long timestamp);
}
