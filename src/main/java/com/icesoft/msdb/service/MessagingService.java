package com.icesoft.msdb.service;

import com.icesoft.msdb.domain.User;

public interface MessagingService {

    void sendNotification(User user, String something);
}
