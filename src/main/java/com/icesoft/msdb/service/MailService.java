package com.icesoft.msdb.service;

import com.icesoft.msdb.domain.User;

public interface MailService {

    public void sendEmail(String to, String subject, String content, boolean isMultipart, boolean isHtml);

    public void sendActivationEmail(User user);

    public void sendCreationEmail(User user);

    public void sendPasswordResetMail(User user);

    public void sendSocialRegistrationValidationEmail(User user, String provider);
}
