package com.icesoft.msdb.repository.subscriptions;

import com.icesoft.msdb.domain.subscriptions.Sessions;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SessionsRepository extends MongoRepository<Sessions, Long> {
}
