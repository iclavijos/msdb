alter table msdb.series_edition add column edition_name varchar(150) not null;

ALTER TABLE msdb.event_entry DROP FOREIGN KEY FKfxa5a518g3l1rycm1eoeij69j;
ALTER TABLE msdb.event_entry DROP COLUMN driver_id,
ADD COLUMN rookie BIT(1) NULL DEFAULT 0 AFTER team_name,
DROP INDEX FKfxa5a518g3l1rycm1eoeij69j;

create table categories_series (series_edition_id bigint not null, category_id bigint not null) ENGINE=InnoDB;
alter table categories_series add constraint FKe6oknu2tfcwok6l6ia6skosnu foreign key (category_id) references category (id);
alter table categories_series add constraint FKjhsogr1paqfwqi4dd9gffbwra foreign key (series_edition_id) references series_edition (id);

ALTER TABLE msdb.series_edition DROP FOREIGN KEY FKmucx0ci2ehufhba1sk6f6w8r7;
ALTER TABLE msdb.series_edition DROP COLUMN allowed_categories_id, DROP INDEX FKmucx0ci2ehufhba1sk6f6w8r7;

create table points_series (series_edition_id bigint not null, points_id bigint not null) ENGINE=InnoDB;
alter table points_series add constraint FKri7j3gnh8ccaj2if7msod920r foreign key (points_id) references points_system (id);
alter table points_series add constraint FKammb81iu4wvocnl5u8ie8reob foreign key (series_edition_id) references series_edition (id);

alter table msdb.event_edition add column winner_id bigint;
alter table event_edition add constraint FKr4vstpjyvq0uew4677t38i0r6 foreign key (winner_id) references driver (id);