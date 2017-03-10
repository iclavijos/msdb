package com.icesoft.msdb.service;

import com.icesoft.msdb.MSDBException;

public interface CDNService {

	String uploadImage(String imageId, byte[] imageData, String folder) throws MSDBException;
	void deleteImage(String imageId, String folder) throws MSDBException; 
}
