package com.icesoft.msdb.domain.subscriptions;

import lombok.Data;

@Data
public class TelegramGroupSubscriptionKey {
    private Long seriesId;
    private Long chatId;

    public TelegramGroupSubscriptionKey(Long seriesId, Long chatId) {
        this.seriesId = seriesId;
        this.chatId = chatId;
    }
}
