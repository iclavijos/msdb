package com.icesoft.msdb.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;

@Configuration
public class CloudinaryConfig {
	
	private ApplicationProperties appProperties;
	
	public CloudinaryConfig(ApplicationProperties appProperties) {
		this.appProperties = appProperties;
	}
	
	@Bean
	public Cloudinary getCloudinary() {
		Map<String, String> config = new HashMap<>();
		config.put("cloud_name", appProperties.getCloudinary().getName());
		config.put("api_key", appProperties.getCloudinary().getKey());
		config.put("api_secret", appProperties.getCloudinary().getSecret());
		return new Cloudinary(config);
	}
}
