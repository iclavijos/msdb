update event_session set session_type = lower(session_type);

update event_session set session_type = 'qualifyingRace' where session_type = 'qualifyingrace';
