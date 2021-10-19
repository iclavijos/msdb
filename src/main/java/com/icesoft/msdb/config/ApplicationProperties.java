package com.icesoft.msdb.config;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Motorsports Database.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
@Getter
public class ApplicationProperties {

	private final SendGrid sendgrid = new SendGrid();
	private final Cloudinary cloudinary = new Cloudinary();
    private final Geolocation geolocation = new Geolocation();

    @Getter @Setter
	public class SendGrid {
		private String key;
	}

    @Getter @Setter
	public class Cloudinary {
		private String name;
		private String key;
		private String secret;
	}

    @Getter @Setter
    public class Geolocation {
        private String key;
    }
}
