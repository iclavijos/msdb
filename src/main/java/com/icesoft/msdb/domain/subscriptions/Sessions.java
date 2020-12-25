package com.icesoft.msdb.domain.subscriptions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.icesoft.msdb.domain.EventSession;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Document(collection = "sessionsData")
@Data
public class Sessions {

    @Id
    private Long timestamp;

    private List<SessionData> sessions = new ArrayList<>();

    public Sessions(Long timestamp) {
        this.timestamp = timestamp;
    }

    public void removeSession(EventSession session) {
        sessions.removeIf(sess -> sess.getSessionId().equals(session.getId()));
    }

    public void addSession(EventSession session) {
        // Check if session already existed in collection
        Optional<SessionData> optSessionData = sessions.stream()
            .filter(sess -> sess.getSessionId().equals(session.getId()))
            .findFirst();

        if (optSessionData.isPresent()) {
            optSessionData.get().setSessionName(session.getName());
        } else {
            SessionData sessionData = SessionData.builder()
                .sessionId(session.getId())
                .sessionName(session.getName())
                .build();

            sessions.add(sessionData);
        }
    }

    @JsonIgnore
    public boolean isEmpty() {
        return sessions.isEmpty();
    }
}
