package com.icesoft.msdb.service;

import java.io.IOException;
import java.util.Locale;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring4.SpringTemplateEngine;

import com.icesoft.msdb.config.ApplicationProperties;
import com.icesoft.msdb.domain.User;
import com.sendgrid.Content;
import com.sendgrid.Email;
import com.sendgrid.Mail;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.SendGrid;

import io.github.jhipster.config.JHipsterProperties;

@Service("sendGridMailService")
public class SendGridMailService implements MailService {
	private final Logger log = LoggerFactory.getLogger(SendGridMailService.class);
	
	private static final String USER = "user";

    private static final String BASE_URL = "baseUrl";

    private final JHipsterProperties jHipsterProperties;
    
    private final SpringTemplateEngine templateEngine;
    
    private final MessageSource messageSource;
	
	private final SendGrid sendgrid;
	
	public SendGridMailService(ApplicationProperties properties, JHipsterProperties jHipsterProperties, 
			SpringTemplateEngine templateEngine, MessageSource messageSource) {
		sendgrid = new SendGrid(properties.getSendgrid().getKey());
		this.jHipsterProperties = jHipsterProperties;
		this.templateEngine = templateEngine;
		this.messageSource = messageSource;
	}

	@Override
	public void sendEmail(String to, String subject, String content, boolean isMultipart, boolean isHtml) {
		log.debug("Send e-mail[multipart '{}' and html '{}'] to '{}' with subject '{}' and content={}",
				isMultipart, isHtml, to, subject, content);

		Email from = new Email("robot@msdb.com");
	    Email toEmail = new Email(to);
	    String contentType = isHtml ? "text/html" : "text/plain";
	    Content mailContent = new Content(contentType, content);
	    Mail mail = new Mail(from, subject, toEmail, mailContent);
	    
	    Request request = new Request();
	    try {
	    	request.method = Method.POST;
	    	request.endpoint = "mail/send";
	    	request.body = mail.build();
	    	sendgrid.api(request);
	    	log.debug("Sent e-mail to User '{}'", to);
	    } catch (IOException ex) {
	    	log.warn("E-mail could not be sent to user '{}'", to, ex);
	    }
	}

	@Override
	public void sendActivationEmail(User user) {
		log.debug("Sending activation e-mail to '{}'", user.getEmail());
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());
        String content = templateEngine.process("activationEmail", context);
        String subject = messageSource.getMessage("email.activation.title", null, locale);
        sendEmail(user.getEmail(), subject, content, false, true);		
	}

	@Override
	public void sendCreationEmail(User user) {
		log.debug("Sending creation e-mail to '{}'", user.getEmail());
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());
        String content = templateEngine.process("creationEmail", context);
        String subject = messageSource.getMessage("email.activation.title", null, locale);
        sendEmail(user.getEmail(), subject, content, false, true);		
	}

	@Override
	public void sendPasswordResetMail(User user) {
		log.debug("Sending password reset e-mail to '{}'", user.getEmail());
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());
        String content = templateEngine.process("passwordResetEmail", context);
        String subject = messageSource.getMessage("email.reset.title", null, locale);
        sendEmail(user.getEmail(), subject, content, false, true);
	}

	@Override
	public void sendSocialRegistrationValidationEmail(User user, String provider) {
		log.debug("Sending social registration validation e-mail to '{}'", user.getEmail());
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable("provider", StringUtils.capitalize(provider));
        String content = templateEngine.process("socialRegistrationValidationEmail", context);
        String subject = messageSource.getMessage("email.social.registration.title", null, locale);
        sendEmail(user.getEmail(), subject, content, false, true);
	}

}
