package com.icesoft.msdb.service;

import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.User;

public interface MessagingService {

    void sendSessionNotification(User user, EventSession session);
}
