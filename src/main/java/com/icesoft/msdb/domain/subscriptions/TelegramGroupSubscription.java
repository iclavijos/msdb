package com.icesoft.msdb.domain.subscriptions;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
@Builder
public class TelegramGroupSubscription {
    @Id
    private TelegramGroupSubscriptionKey id;
    private String seriesName;
    private Boolean notifyRaces;
    private Boolean notifyQualifying;
    private Boolean notifyPractice;
}
