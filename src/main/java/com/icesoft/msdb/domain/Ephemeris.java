package com.icesoft.msdb.domain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Ephemeris {

    List<EphemerisItem> ephemerisItems = new ArrayList<>();

    protected enum EphemerisEnum {
        BORN,
        DEAD,
        RACE
    }

    public class EphemerisItem {
        private String name;
        private String detail;
        private LocalDate date;
        private Integer age;
        private EphemerisEnum type;
        private String place;

        public EphemerisItem(Driver driver, EphemerisEnum type) {
            this.name = driver.getFullName();
            this.type = type;
            if (type == EphemerisEnum.BORN) {
                this.date = driver.getBirthDate();
                this.place = driver.getBirthPlace();
                this.age = LocalDate.now().getYear() - driver.getBirthDate().getYear();
            } else if (type == EphemerisEnum.DEAD) {
                this.date = driver.getDeathDate();
                this.place = driver.getDeathPlace();
                this.age = driver.getAge();
            }
        }

        public EphemerisItem(EventSession eventSession) {
            this.date = eventSession.getSessionStartTimeDate().toLocalDate();
            this.place = eventSession.getEventEdition().getTrackLayout().getRacetrack().getName();
            this.type = EphemerisEnum.RACE;
            this.name = eventSession.getEventEdition().getLongEventName();
            if (!eventSession.getName().equalsIgnoreCase("RACE")) {
                this.detail = eventSession.getName();
            }

        }

        public String getName() { return this.name; }
        public String getDetail() { return this.detail; }
        public LocalDate getDate() { return this.date; }
        public Integer getAge() { return this.age; }
        public EphemerisEnum getType() { return this.type; }
        public String getPlace() { return this.place; }
    }

    public Ephemeris(
        List<Driver> bornDrivers,
        List<Driver> deadDrivers,
        List<EventSession> sessions
    ) {
        bornDrivers.forEach(d -> ephemerisItems.add(new EphemerisItem(d, EphemerisEnum.BORN)));
        deadDrivers.forEach(d -> ephemerisItems.add(new EphemerisItem(d, EphemerisEnum.DEAD)));
        sessions.forEach(s -> ephemerisItems.add(new EphemerisItem(s)));
        ephemerisItems.sort((d1, d2) -> d1.date.compareTo(d2.date));
    }

    public List<EphemerisItem> getEphemerisItems() { return this.ephemerisItems; }
}
