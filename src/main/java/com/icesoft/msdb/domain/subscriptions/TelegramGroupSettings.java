package com.icesoft.msdb.domain.subscriptions;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
@Builder
public class TelegramGroupSettings {
    private Long id;
    private String languageCode;
}
