package com.icesoft.msdb.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.icesoft.msdb.service.MailService;

@Configuration
public class MailServiceConfiguration {
	
	private final MailService smtpMailService;
	private final MailService sendGridMailService;
	
	public MailServiceConfiguration(@Qualifier("smtpMailService") MailService smtpMailService,
									@Qualifier("sendGridMailService") MailService sendGridMailService) {
		this.smtpMailService = smtpMailService;
		this.sendGridMailService = sendGridMailService;
	}

    @Bean
    @Profile("dev")
    public MailService mailServiceDev() {
        return smtpMailService;
    }
    
    @Bean
    @Profile("prod")
    public MailService mailServiceProd() {
        return sendGridMailService;
    }
}
