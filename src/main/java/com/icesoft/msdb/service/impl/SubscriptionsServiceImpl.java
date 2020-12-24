package com.icesoft.msdb.service.impl;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.subscriptions.Sessions;
import com.icesoft.msdb.repository.subscriptions.SessionsRepository;
import com.icesoft.msdb.service.SubscriptionsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class SubscriptionsServiceImpl implements SubscriptionsService {

    private final SessionsRepository sessionsRepository;

    public SubscriptionsServiceImpl(SessionsRepository sessionsRepository) {
        this.sessionsRepository = sessionsRepository;
    }

    @Override
    public void saveEventSession(EventSession session) {
        saveEventSession(session, session.getSessionStartTime());
    }

    @Override
    public void saveEventSession(EventSession session, Long oldTimestamp) {
        // Check if session needs to be removed from previous timestamp
        if (!session.getSessionStartTime().equals(oldTimestamp)) {
            sessionsRepository.findById(oldTimestamp).ifPresent(
                sessions -> {
                    sessions.removeSession(session);
                    sessionsRepository.save(sessions);
                }
            );
        }
        Sessions sessions = sessionsRepository
            .findById(session.getSessionStartTime())
            .orElse(new Sessions(session.getSessionStartTime()));

        sessions.addSession(session);
        sessionsRepository.save(sessions);
    }

    @Override
    public void deleteEventSession(EventSession session) {
        sessionsRepository.findById(session.getSessionStartTime()).ifPresent(
            sessions -> {
                sessions.removeSession(session);
                if (sessions.isEmpty()) {
                    sessionsRepository.deleteById(session.getSessionStartTime());
                } else {
                    sessionsRepository.save(sessions);
                }
            }
        );
    }
}
