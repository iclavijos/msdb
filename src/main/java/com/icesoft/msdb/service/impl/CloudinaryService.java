package com.icesoft.msdb.service.impl;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.service.CDNService;

@Service
public class CloudinaryService implements CDNService {

	private final Logger log = LoggerFactory.getLogger(CloudinaryService.class);

	@Autowired Cloudinary cloudinary;

	@Override
	public String uploadImage(String imageId, byte[] imageData, String folder) throws MSDBException {
		Map params = ObjectUtils.asMap("public_id", folder + "/" + imageId);
        File file = new File("/tmp/" + folder + "_" + imageId);
        try {
	        FileUtils.writeByteArrayToFile(file, imageData);
			Map<String, String> imgUpload = cloudinary.uploader().upload(file, params);
			return imgUpload.get("secure_url");
        } catch (IOException e) {
        	log.error("Image could not be uploaded to CDN", e);
        	throw new MSDBException(e);
        } finally {
        	if (file != null) file.delete();
        }
	}

	@Override
	public void deleteImage(String imageId, String folder) throws MSDBException {
		try {
			cloudinary.uploader().destroy(folder + "/" + imageId, ObjectUtils.emptyMap());
		} catch (IOException e) {
			log.warn("Image could not be deleted from CDN", e);
		}

	}

}
