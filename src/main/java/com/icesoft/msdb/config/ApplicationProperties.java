package com.icesoft.msdb.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Motorsports Database.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

	private final SendGrid sendgrid = new SendGrid();
	private final Cloudinary cloudinary = new Cloudinary();

	public static class SendGrid {
		private String key;

		public String getKey() {
			return key;
		}

		public void setKey(String key) {
			this.key = key;
		}
	}

	public static class Cloudinary {
		private String name;
		private String key;
		private String secret;

		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getKey() {
			return key;
		}
		public void setKey(String key) {
			this.key = key;
		}
		public String getSecret() {
			return secret;
		}
		public void setSecret(String secret) {
			this.secret = secret;
		}
	}

	public SendGrid getSendgrid() {
		return sendgrid;
	}

	public Cloudinary getCloudinary() {
		return cloudinary;
	}
}
