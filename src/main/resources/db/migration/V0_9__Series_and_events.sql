alter table msdb.event_session add column points_system_id bigint;
alter table event_session add constraint FKp794uhpkjc1errhm42lok61q5 foreign key (points_system_id) references points_system (id);

ALTER TABLE msdb.event_entry_result ADD COLUMN starting_position INT(11) NULL DEFAULT NULL;
