package com.icesoft.msdb.service;

import com.icesoft.msdb.domain.EventSession;

public interface SubscriptionsService {

    void saveEventSession(EventSession session);

    void saveEventSession(EventSession session, Long oldTimestamp);

    void deleteEventSession(EventSession session);
}
