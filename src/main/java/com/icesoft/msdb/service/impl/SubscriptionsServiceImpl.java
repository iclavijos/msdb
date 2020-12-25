package com.icesoft.msdb.service.impl;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.domain.User;
import com.icesoft.msdb.domain.UserSubscription;
import com.icesoft.msdb.domain.enums.SessionType;
import com.icesoft.msdb.domain.subscriptions.SessionData;
import com.icesoft.msdb.domain.subscriptions.Sessions;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.UserRepository;
import com.icesoft.msdb.repository.UserSubscriptionRepository;
import com.icesoft.msdb.repository.subscriptions.SessionsRepository;
import com.icesoft.msdb.service.SubscriptionsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@Transactional
@Slf4j
public class SubscriptionsServiceImpl implements SubscriptionsService {

    private final SessionsRepository sessionsRepository;
    private final EventSessionRepository eventSessionRepository;
    private final UserRepository userRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;

    public SubscriptionsServiceImpl(SessionsRepository sessionsRepository,
                                    EventSessionRepository eventSessionRepository,
                                    UserRepository userRepository,
                                    UserSubscriptionRepository userSubscriptionRepository) {
        this.sessionsRepository = sessionsRepository;
        this.eventSessionRepository = eventSessionRepository;
        this.userRepository = userRepository;
        this.userSubscriptionRepository = userSubscriptionRepository;
    }

    @Scheduled(cron = "0 * * * * *")
    public void generateNotifications() {
        OffsetDateTime utc = OffsetDateTime.now(ZoneOffset.UTC);

        List<SessionData> sessionsData = StreamSupport
            .stream(
                sessionsRepository.findAllById(
                    Arrays.asList(
                        utc.plusMinutes(15).toEpochSecond(),
                        utc.plusHours(1).toEpochSecond(),
                        utc.plusHours(3).toEpochSecond())
                ).spliterator(),false)
            .flatMap(sessions -> sessions.getSessions().stream())
            .collect(Collectors.toList());

        List<EventSession> eventSessions = eventSessionRepository
            .findAllById(sessionsData.stream()
                .map(session -> session.getSessionId())
                .collect(Collectors.toList())
            );

        List<SeriesEdition> seriesEds = eventSessions.stream()
            .flatMap(session -> session.getEventEdition().getSeriesEditions().stream())
            .distinct()
            .collect(Collectors.toList());

        List<UserSubscription> usersSubs = userSubscriptionRepository.findAllBySeriesEdition(seriesEds);
        usersSubs.forEach(userSubscription -> {
            eventSessions.stream()
                .filter(eventSession -> eventSession.getEventEdition().getSeriesEditions()
                    .stream().map(seriesEdition -> seriesEdition.getId()).collect(Collectors.toList())
                    .contains(userSubscription.getSeriesEdition().getId()))
                .forEach(
                    eventSession -> {
                        SessionType sessionType = eventSession.getSessionType();
                        if (userSubscription.getPracticeSessions() && sessionType.equals(SessionType.PRACTICE) ||
                            userSubscription.getQualiSessions() && sessionType.equals(SessionType.QUALIFYING) ||
                            userSubscription.getRaces() && (sessionType.equals(SessionType.QUALIFYING_RACE) || sessionType.equals(SessionType.RACE))) {
                            log.debug("Sending notification to {} about {} of {} as it will happen at {}",
                                userSubscription.getUser(),
                                eventSession.getName(),
                                eventSession.getEventEdition().getLongEventName(),
                                eventSession.getSessionStartTimeDate());
                            sendNotification(eventSession, userSubscription.getUser());
                        }
                    });
        });
    }

    private void sendNotification(EventSession session, User user) {

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
                    if (sessions.isEmpty()) {
                        sessionsRepository.deleteById(oldTimestamp);
                    } else {
                        sessionsRepository.save(sessions);
                    }
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
