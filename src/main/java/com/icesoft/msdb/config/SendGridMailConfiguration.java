package com.icesoft.msdb.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.icesoft.msdb.service.MailService;

@Configuration
@Profile("prod")
public class SendGridMailConfiguration {
	
	private final Logger log = LoggerFactory.getLogger(SendGridMailConfiguration.class);
	
	@Autowired
	@Qualifier("sendGridMailService")
	private MailService sendGridMailService;

    @Bean
    public MailService mailServiceProd() {
    	log.debug("Using SendGridMailService...");
        return sendGridMailService;
    }
}
