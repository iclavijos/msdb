package com.icesoft.msdb.domain.subscriptions;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SessionData {
    private Long sessionId;
    private String sessionName;
}
