update event_session
set max_duration = max_duration * 60
where max_duration is not null;

