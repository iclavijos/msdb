package com.icesoft.msdb.repository.mongo.subscriptions;

import com.icesoft.msdb.domain.subscriptions.TelegramGroupSettings;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TelegramGroupSettingsRepository extends MongoRepository<TelegramGroupSettings, Long> {

}
