package com.icesoft.msdb.config;

import com.pengrad.telegrambot.TelegramBot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TelegramBotConfiguration {

    @Autowired
    private ApplicationProperties applicationProperties;

    @Bean
    public TelegramBot telegramBot() {
        return new TelegramBot(applicationProperties.getTelegramBot().getToken());
    }
}
