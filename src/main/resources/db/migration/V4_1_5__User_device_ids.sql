CREATE TABLE `user_device_ids` (
  `user_id` varchar(100) CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci' NOT NULL,
  `device_ids` varchar(200) NOT NULL,
  PRIMARY KEY (`user_id`, `device_ids`),
  CONSTRAINT `FK_jhi_user` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
)
