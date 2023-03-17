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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
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
    private final VelocityEngine velocityEngine;

    private void sendMessage(String messageContent) {
        sendMessage(messageContent, applicationProperties.getTelegramBot().getChannelId());
    }

    private void sendMessage(String messageContent, String channelId) {
        SendMessage sendMessage = new SendMessage(channelId, messageContent);
        sendMessage.parseMode(ParseMode.HTML);
        SendResponse response = telegramBot.execute(sendMessage);
        if (!response.isOk()) {
            log.error("Couldn't deliver message to Telegram channel: {}-{}", response.errorCode(), response.description());
            if (response.errorCode() == 403) {
                // Remove subscription
                try {
                    Long chatId = Long.parseLong(channelId);
                    log.trace("Removing subscriptions and settings");
                    telegramGroupSubscriptionRepository.deleteByIdChatId(chatId);
                    telegramGroupSettingsRepository.deleteById(chatId);
                } catch (NumberFormatException e) {
                    // Do nothing. This should not happen, as the only non Long Id is for MSDB Bot Channel
                    log.warn("Received a non numeric channel Id when trying to unsubscribe a channel: {}", channelId);
                }
            }
        }
    }

    public void notifySession(EventSession eventSession, Integer minutesToStart) {
        StringBuffer message = new StringBuffer();

        List<Long> seriesIds = eventSession.getEventEdition().getSeriesEditions()
            .stream().map(seriesEdition -> seriesEdition.getSeries().getId()).collect(Collectors.toList());

        log.trace("Retrieving subscriptions for series ids {}", seriesIds.stream().map(Object::toString).collect(Collectors.joining(",")));

        List<TelegramGroupSubscription> subscriptions = telegramGroupSubscriptionRepository.findAllByIdSeriesId(seriesIds);
        Set<TelegramGroupSettings> settings = telegramGroupSettingsRepository.findAll().stream().collect(Collectors.toUnmodifiableSet());

        VelocityContext model = new VelocityContext();
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
        log.trace("Retrieved {} settings and {} subscriptions", settings.size(), subscriptions.size());
        subscriptions.parallelStream().forEach(subscription -> {
            log.trace("Subscription: {}", subscription.toString());
            Optional<TelegramGroupSettings> optSettings = settings.stream()
                .filter(groupSettings -> groupSettings.getId().equals(subscription.getId().getChatId()))
                .findFirst();

            if (optSettings.isEmpty() || optSettings.get().getMinutesNotification().contains(minutesToStart)) {
                if (eventSession.isRace() || eventSession.getSessionType().equals(SessionType.STAGE) ||
                    eventSession.getSessionType().equals(SessionType.PRACTICE) && subscription.getNotifyPractice() ||
                    eventSession.getSessionType().equals(SessionType.QUALIFYING) && subscription.getNotifyQualifying()) {
                    log.trace("Sending message to chatId {}", subscription.getId().getChatId());
                    String languageCode = optSettings.orElse(TelegramGroupSettings.builder().languageCode("EN").build()).getLanguageCode();
                    sendMessage(generateMessageContents(model, languageCode), subscription.getId().getChatId().toString());
                }
            }
        });

        // Send message to bot channel
        sendMessage(generateMessageContents(model, "EN"));
    }

    private String generateMessageContents(VelocityContext model, String languageCode) {
        Locale groupLocale = Locale.forLanguageTag(languageCode);
        StringWriter stringWriter = new StringWriter();
        log.trace("Generating message for locale {} and data {}", groupLocale, model);
        velocityEngine.mergeTemplate(
            String.format("templates/telegram/message_%s.vm", groupLocale.getLanguage()),
            "UTF-8", model, stringWriter);
        return stringWriter.toString();
    }
}
