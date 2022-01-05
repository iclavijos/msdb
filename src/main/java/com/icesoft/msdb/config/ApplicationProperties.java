package com.icesoft.msdb.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Motorsports Database.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link tech.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
@Getter
public class ApplicationProperties {

	private final SendGrid sendgrid = new SendGrid();
	private final Cloudinary cloudinary = new Cloudinary();
    private final Geolocation geolocation = new Geolocation();
    private final TimeZone timeZone = new TimeZone();

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

    @Setter
    public class TimeZone {
        private String key;
        private String url;

        public String getServiceUrl() {
            return String.format(url, key);
        }
    }
}
