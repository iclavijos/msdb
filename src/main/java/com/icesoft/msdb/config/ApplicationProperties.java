package com.icesoft.msdb.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to JHipster.
 *
 * <p>
 *     Properties are configured in the application.yml file.
 * </p>
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {
	
	private final SendGrid sendgrid = new SendGrid();
	
	private String elasticserver = "";
	
	public static class SendGrid {
		private String key;

		public String getKey() {
			return key;
		}

		public void setKey(String key) {
			this.key = key;
		}
	}

	public SendGrid getSendgrid() {
		return sendgrid;
	}
	
	public void setElasticserver(String url) {
		this.elasticserver = url;
	}
	
	public String getElasticserver() {
		return elasticserver;
	}
}
