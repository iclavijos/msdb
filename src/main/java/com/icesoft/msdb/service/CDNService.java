package com.icesoft.msdb.service;

import com.icesoft.msdb.MSDBException;

public interface CDNService {

	String uploadImage(String imageId, byte[] imageData) throws MSDBException;
	void deleteImage(String imageId) throws MSDBException; 
}
