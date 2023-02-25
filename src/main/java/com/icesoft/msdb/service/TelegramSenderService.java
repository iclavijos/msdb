package com.icesoft.msdb.service;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.config.ApplicationProperties;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.domain.enums.SessionType;
import com.icesoft.msdb.domain.subscriptions.TelegramGroupSettings;
import com.icesoft.msdb.domain.subscriptions.TelegramGroupSubscription;
import com.icesoft.msdb.repository.mongo.subscriptions.TelegramGroupSettingsRepository;
import com.icesoft.msdb.repository.mongo.subscriptions.TelegramGroupSubscriptionRepository;
import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.model.request.ParseMode;
import com.pengrad.telegrambot.request.SendMessage;
import com.pengrad.telegrambot.response.SendResponse;
import freemarker.template.TemplateException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfig;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class TelegramSenderService {
    private final ApplicationProperties applicationProperties;
    private final TelegramBot telegramBot;
    private final TelegramGroupSubscriptionRepository telegramGroupSubscriptionRepository;
    private final TelegramGroupSettingsRepository telegramGroupSettingsRepository;
    private final FreeMarkerConfig freeMarkerConfig;

    private void sendMessage(String messageContent) {
        sendMessage(messageContent, applicationProperties.getTelegramBot().getChannelId());
    }

    private void sendMessage(String messageContent, String channelId) {
        SendMessage sendMessage = new SendMessage(channelId, messageContent);
        sendMessage.parseMode(ParseMode.HTML);
        SendResponse response = telegramBot.execute(sendMessage);
        if (!response.isOk()) {
            log.error("Couldn't deliver message to Telegram channel: {}-{}", response.errorCode(), response.description());
        }
    }

    public void notifySession(EventSession eventSession, Integer minutesToStart) {
        StringBuffer message = new StringBuffer();

        List<Long> seriesIds = eventSession.getEventEdition().getSeriesEditions()
            .stream().map(seriesEdition -> seriesEdition.getSeries().getId()).collect(Collectors.toList());

        log.trace("Retrieving subscriptions for series ids {}", seriesIds.stream().map(Object::toString).collect(Collectors.joining(",")));

        List<TelegramGroupSubscription> subscriptions = telegramGroupSubscriptionRepository.findAllByIdSeriesId(seriesIds);

        Map<String, Object> model = new HashMap<>();
        model.put("session", eventSession);
        model.put("rallyOrRaid", eventSession.getEventEdition().getEvent().isRaid() || eventSession.getEventEdition().getEvent().isRally());
        model.put("minutesToStart", minutesToStart);

        if (!eventSession.getEventEdition().getSeriesEditions().isEmpty()) {
            Optional<SeriesEdition> seriesEdition = eventSession.getEventEdition().getSeriesEditions().stream().findFirst();
            if (seriesEdition.isPresent()) {
                Optional<String> optLogoUrl = Optional.ofNullable(seriesEdition.get().getLogoUrl());
                model.put("logoUrl", optLogoUrl.map(url -> url.replace(".png", ".jpg")).orElse(null));
            }
        }

        // Send message to each subscribed channel
        Set<TelegramGroupSettings> settings = telegramGroupSettingsRepository.findAll().stream().collect(Collectors.toUnmodifiableSet());
        log.trace("Retrieved {} settings and {} subscriptions", settings.size(), subscriptions.size());
        subscriptions.parallelStream().forEach(subscription -> {
            log.trace("Subscription: {}", subscription.toString());
            Optional<String> optSettings = settings.stream()
                .filter(groupSettings -> groupSettings.getId().equals(subscription.getId().getChatId()))
                .map(TelegramGroupSettings::getLanguageCode).findFirst();
            log.trace("Settings: {}", optSettings.orElse("No settings found"));
            if (eventSession.isRace() || eventSession.getSessionType().equals(SessionType.STAGE) ||
                eventSession.getSessionType().equals(SessionType.PRACTICE) && subscription.getNotifyPractice() ||
                eventSession.getSessionType().equals(SessionType.QUALIFYING) && subscription.getNotifyQualifying()) {
                log.trace("Sending message to chatId {}", subscription.getId().getChatId());
                sendMessage(generateMessageContents(model, optSettings), subscription.getId().getChatId().toString());
            }
        });

        // Send message to bot channel
        sendMessage(generateMessageContents(model, Optional.empty()));
    }

    private String generateMessageContents(Map<String, Object> model, Optional<String> optSettings) {
        try {
            return FreeMarkerTemplateUtils.processTemplateIntoString(
                freeMarkerConfig.getConfiguration().getTemplate(
                    "telegram/message.ftlh",
                    Locale.forLanguageTag(optSettings.orElse("EN"))),
                model);
        } catch (IOException | TemplateException e) {
            log.error("Freemarker error", e);
            throw new MSDBException("Couldn't process message template");
        }
    }
}
