package com.icesoft.msdb.domain.subscriptions;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Arrays;
import java.util.List;

@Document
@Data
@Builder
public class TelegramGroupSettings {
    private Long id;
    private String languageCode;
    @Builder.Default
    private List<Integer> minutesNotification = Arrays.asList(15, 60, 180);
}
