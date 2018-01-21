package com.icesoft.msdb.config;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.spring4.SpringTemplateEngine;

import com.icesoft.msdb.service.MailService;
import com.icesoft.msdb.service.SMTPMailService;
import com.icesoft.msdb.service.SendGridMailService;

import io.github.jhipster.config.JHipsterProperties;

@Configuration
public class MailServiceConfiguration {
	
	private final ApplicationProperties applicationProperties;
	
	private final JHipsterProperties jHipsterProperties;

    private final JavaMailSender javaMailSender;

    private final MessageSource messageSource;

    private final SpringTemplateEngine templateEngine;
    
	public MailServiceConfiguration(ApplicationProperties applicationProperties, JHipsterProperties jHipsterProperties, 
			JavaMailSender javaMailSender, MessageSource messageSource,
			SpringTemplateEngine templateEngine) {
		this.applicationProperties = applicationProperties;
		this.jHipsterProperties = jHipsterProperties;
		this.javaMailSender = javaMailSender;
		this.messageSource = messageSource;
		this.templateEngine = templateEngine;
	}

    @Bean
    @Profile({"dev", "test"})
    public MailService mailServiceDev() {
        return new SMTPMailService(jHipsterProperties, javaMailSender, messageSource, templateEngine);
    }
    
    @Bean
    @Profile("prod")
    public MailService mailServiceProd() {
        return new SendGridMailService(applicationProperties, jHipsterProperties, templateEngine, messageSource);
    }
}
