package com.icesoft.msdb.service;

import com.icesoft.msdb.config.ApplicationProperties;
import com.icesoft.msdb.domain.Event;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.SeriesEdition;
import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.model.request.InputTextMessageContent;
import com.pengrad.telegrambot.model.request.ParseMode;
import com.pengrad.telegrambot.request.SendMessage;
import com.pengrad.telegrambot.response.SendResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class TelegramSenderService {

    private static final String MESSAGE_IMG = "<a href=\"%s\">&#8205;</a>";
    private static final String MESSAGE_PATTERN = "<b>%s</b> session belonging to <b>%s</b> will start in %s";
    private static final String MESSAGE_PATTERN_AT = " at <b>%s</b>";

    private static final String FIFTEEN_MIN = "15 minutes";
    private static final String ONE_HOUR = "1 hour";
    private static final String THREE_HOURS = "3 hours";

    private final ApplicationProperties applicationProperties;
    private final TelegramBot telegramBot;

    private void sendMessage(String messageContent) {
        SendMessage sendMessage = new SendMessage(
            applicationProperties.getTelegramBot().getChannelId(),
            messageContent);
        sendMessage.parseMode(ParseMode.HTML);
        SendResponse response = telegramBot.execute(sendMessage);
        if (!response.isOk()) {
            log.error("Couldn't deliver message to Telegram channel: {}-{}", response.errorCode(), response.description());
        }
    }

    public void sendMessage(EventSession eventSession, Integer minutesToStart) {
        String message = String.format(MESSAGE_PATTERN,
            eventSession.getName(),
            eventSession.getEventEdition().getLongEventName(),
            minutesToStart == 15 ? FIFTEEN_MIN :
                minutesToStart == 60 ? ONE_HOUR : THREE_HOURS);
        Event event = eventSession.getEventEdition().getEvent();
        if (!event.isRaid() && !event.isRally()) {
            message += String.format(MESSAGE_PATTERN_AT,
                eventSession.getEventEdition().getTrackLayout().getRacetrack().getName());
        }
        if (!eventSession.getEventEdition().getSeriesEditions().isEmpty()) {
            Optional<SeriesEdition> seriesEdition = eventSession.getEventEdition().getSeriesEditions().stream().findFirst();
            if (seriesEdition.isPresent()) {
                message = String.format(MESSAGE_IMG, seriesEdition.get().getLogoUrl().replace(".png", ".jpg")) + message;
            }
        }
        sendMessage(message);
    }
}
