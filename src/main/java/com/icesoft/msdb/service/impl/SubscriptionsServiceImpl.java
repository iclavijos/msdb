package com.icesoft.msdb.service.impl;

import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.domain.enums.EventStatusType;
import com.icesoft.msdb.domain.enums.SessionType;
import com.icesoft.msdb.domain.subscriptions.SessionData;
import com.icesoft.msdb.domain.subscriptions.Sessions;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.UserRepository;
import com.icesoft.msdb.repository.UserSubscriptionRepository;
import com.icesoft.msdb.repository.subscriptions.SessionsRepository;
import com.icesoft.msdb.service.MessagingService;
import com.icesoft.msdb.service.SubscriptionsService;
import com.icesoft.msdb.service.TelegramSenderService;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class SubscriptionsServiceImpl implements SubscriptionsService {

    private final SessionsRepository sessionsRepository;
    private final EventSessionRepository eventSessionRepository;
    private final UserRepository userRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final MessagingService messagingService;
    private final TelegramSenderService telegramSenderService;

    @Scheduled(cron = "0 * * * * *")
    @Transactional(readOnly = true)
    public void generateNotifications() {
        OffsetDateTime utc = OffsetDateTime.now(ZoneOffset.UTC);
        utc = OffsetDateTime.of(
            utc.getYear(), utc.getMonthValue(),
            utc.getDayOfMonth(), utc.getHour(),
            utc.getMinute(), 0, 0, utc.getOffset());
        OffsetDateTime utcPlus15m = utc.plusMinutes(15);
        OffsetDateTime utcPlus1h = utc.plusHours(1);
        OffsetDateTime utcPlus3h = utc.plusHours(3);
        log.trace("Generating notifications at {}", utc);
        List<SessionData> sessionData15m = sessionsRepository
            .findById(utcPlus15m.toEpochSecond())
            .map(sessions -> sessions.getSessions())
            .orElse(Collections.emptyList());
        List<SessionData> sessionData1h = sessionsRepository
            .findById(utcPlus1h.toEpochSecond())
            .map(sessions -> sessions.getSessions())
            .orElse(Collections.emptyList());
        List<SessionData> sessionData3h = sessionsRepository
            .findById(utcPlus3h.toEpochSecond())
            .map(sessions -> sessions.getSessions())
            .orElse(Collections.emptyList());

        Set<SessionData> sessionsData = new HashSet<>();
        sessionsData.addAll(sessionData15m);
        sessionsData.addAll(sessionData1h);
        sessionsData.addAll(sessionData3h);

        List<EventSession> eventSessions = eventSessionRepository
            .findAllById(sessionsData.stream()
                .map(session -> session.getSessionId())
                .collect(Collectors.toList())
            )
            .stream()
                .filter(session -> session.getEventEdition().getStatus().equals(EventStatusType.ONGOING))
                .filter(session -> !session.getCancelled())
                .peek(session -> {
                    log.trace("Session to notify: {}", session.getName());
                    // Send notifications to telegram channel
                    telegramSenderService.sendMessage(session,
                        session.getSessionStartTime().equals(utcPlus15m) ? 15 :
                            session.getSessionStartTime().equals(utcPlus1h)? 60 : 180
                    );
                })
                .collect(Collectors.toList());

        List<Series> seriesEds = eventSessions.stream()
            .flatMap(session -> session.getEventEdition().getSeriesEditions().stream())
            .map(seriesEdition -> seriesEdition.getSeries())
            .distinct()
            .collect(Collectors.toList());

        List<UserSubscription> usersSubs = userSubscriptionRepository.findAllBySeriesIn(seriesEds);
        usersSubs.forEach(userSubscription -> {
            log.trace("User to be notified: {}", userSubscription.getUser().getId());
            eventSessions.stream()
                .filter(eventSession -> eventSession.getEventEdition().getSeriesEditions()
                    .stream().map(seriesEdition -> seriesEdition.getId()).collect(Collectors.toList())
                    .contains(userSubscription.getSeries().getId()))
                .forEach(
                    eventSession -> {
                        if (eventSession.getSessionType().equals(SessionType.STAGE) ||
                            userSubscription.getPracticeSessions() && eventSession.getSessionType().equals(SessionType.PRACTICE) ||
                            userSubscription.getQualiSessions() && eventSession.getSessionType().equals(SessionType.QUALIFYING) ||
                            userSubscription.getRaces() && (eventSession.getSessionType().equals(SessionType.QUALIFYING_RACE)
                                || eventSession.getSessionType().equals(SessionType.RACE))) {

                            if (isUserToBeNotified(userSubscription, eventSession, sessionData15m, sessionData1h, sessionData3h)) {
                                sendNotification(eventSession, userSubscription.getUser());
                            }
                        }
                    });
        });
    }

    private boolean isUserToBeNotified(UserSubscription userSubscription, EventSession eventSession,
        List<SessionData> sessionData15m, List<SessionData> sessionData1h, List<SessionData> sessionData3h) {

        boolean notify = false;
        if (userSubscription.getFifteenMinWarning()) {
            notify = sessionData15m.stream()
                .anyMatch(sessionData -> sessionData.getSessionId().equals(eventSession.getId()));
        }
        if (userSubscription.getOneHourWarning()) {
            notify = notify || sessionData1h.stream()
                .anyMatch(sessionData -> sessionData.getSessionId().equals(eventSession.getId()));
        }
        if (userSubscription.getThreeHoursWarning()) {
            notify = notify || sessionData3h.stream()
                .anyMatch(sessionData -> sessionData.getSessionId().equals(eventSession.getId()));
        }
        return notify;

    }

    private void sendNotification(EventSession session, User user) {
        log.debug("Sending notification to {} about {} of {} as it will happen at {}",
            user.getFirstName(),
            session.getName(),
            session.getEventEdition().getLongEventName(),
            session.getSessionStartTimeDate());

        messagingService.sendSessionNotification(user, session);
    }

    @Scheduled(cron = "0 0 0/12 * * *")
    public void removeExpiredNotifications() {
        OffsetDateTime utc = OffsetDateTime.now(ZoneOffset.UTC);
        sessionsRepository.deleteByTimestampLessThan(utc.toEpochSecond());
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

    @Override
    public void rebuildSessionsData() {
        sessionsRepository.deleteAll();
        OffsetDateTime utc = OffsetDateTime.now(ZoneOffset.UTC);
        eventSessionRepository.findUpcomingSessions(utc.toEpochSecond())
            .forEach(eventSession -> saveEventSession(eventSession));
    }
}
