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
@Profile("dev")
public class SMTPMailServiceConfiguration {
	
	private final Logger log = LoggerFactory.getLogger(SMTPMailServiceConfiguration.class);
	
	@Autowired
	@Qualifier("smtpMailService")
	private MailService smtpMailService;

    @Bean
    public MailService mailServiceDev() {
    	log.debug("Using SMTPMailService...");
        return smtpMailService;
    }
}
