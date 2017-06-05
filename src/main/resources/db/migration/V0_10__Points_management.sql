create table driver_event_points (id bigint not null auto_increment, points float, driver_id bigint, session_id bigint, primary key (id)) ENGINE=InnoDB;
create table team_event_points (id bigint not null auto_increment, points float, session_id bigint, team_id bigint, primary key (id)) ENGINE=InnoDB;
alter table driver_event_points add constraint FKi5xufr8xkwf37bk1mkr6u3513 foreign key (driver_id) references driver (id);
alter table driver_event_points add constraint FK9ylpm9fn2k1ch9ylnsmqgwyn0 foreign key (session_id) references event_session (id);
alter table team_event_points add constraint FKjdgp11uq4r7xdxdtext15x05b foreign key (session_id) references event_session (id);
alter table team_event_points add constraint FKm4qkyplown87jgw5olooq6ej7 foreign key (team_id) references team (id);

alter table event_edition add constraint FK1405khh4c8wuesxkgfwrf3u66 foreign key (winner_id) references event_entry (id);

create or replace view drivers_classification_series as
select concat(d.name, ' ', d.surname) driverName, sum(points) points, series_edition_id
from driver_event_points dep, event_session es, event_edition ee, driver d
where dep.session_id = es.id and es.event_edition_id = ee.id and dep.driver_id = d.id
group by driver_id, series_edition_id
order by points desc;

ALTER TABLE event_edition 
DROP FOREIGN KEY FKr4vstpjyvq0uew4677t38i0r6,
DROP FOREIGN KEY FK1405khh4c8wuesxkgfwrf3u66;
ALTER TABLE event_edition 
DROP COLUMN winner_id,
DROP INDEX FKr4vstpjyvq0uew4677t38i0r6;