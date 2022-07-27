update event_session set session_type = lower(session_type);
update event_session set duration_type = lower(duration_type);

update event_session set session_type = 'qualifyingRace' where session_type = 'qualifying_race';
update event_session set session_type = 'qualifyingRace' where session_type = 'qualifyingrace';
