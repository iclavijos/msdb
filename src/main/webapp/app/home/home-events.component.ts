import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DateTime } from 'luxon';

export class HomeEvent {
  sessionName!: string;
  sessionStartTime!: number | DateTime;
  sessionEndTime!: number | DateTime;
  duration!: number;
  totalDuration!: number;
  durationType!: number;
  sessionType!: string;
  eventId!: number;
  eventEditionId!: number;
  eventName!: string;
  racetrack!: string;
  seriesIds!: number[];
  seriesNames!: string[];
  seriesLogo!: string;
  rally!: boolean;
  raid!: boolean;
  cancelled!: boolean;
}

export class TimeZone {
  countryName!: string;
  zoneName!: string;
  gmtOffset!: string;
}

@Component({
  selector: 'jhi-home-events',
  templateUrl: './home-events.component.html',
  styleUrls: ['./home.scss']
})
export class HomeEventsComponent implements OnInit {
  calendar!: HomeEvent[];
  filteredBySessionTypeCalendar!: HomeEvent[];
  timezone!: string;
  timezones!: TimeZone[];
  noEvents = false;
  dates = new Map<string, DateTime>();
  showRaces = false;
  showQualiSessions = false;
  showPracticeSessions = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.timezone = DateTime.local().zone.name;

    this.http.get<HomeEvent[]>('api/home/calendar').subscribe((res: HomeEvent[]) => {
      this.calendar = this.convertData(res, this.timezone);
      this.filteredBySessionTypeCalendar = this.calendar;
    });
    this.http.get<TimeZone[]>('api/timezones').subscribe((res: TimeZone[]) => {
      this.timezones = res;
    });
  }

  filteredSessions(day: DateTime): HomeEvent[] {
    return this.filteredBySessionTypeCalendar.filter(
      (item: HomeEvent) => (item.sessionStartTime as DateTime).startOf('day').equals(day.startOf('day')));
  }

  changeTimezone(): void {
    this.calendar = this.convertData(this.calendar, this.timezone);
    this.filteredBySessionTypeCalendar = this.calendar;
  }

  filterBySessionType(sessionType: string, isChecked: boolean): boolean {
    if (sessionType === 'races') {
      this.showRaces = isChecked;
    }
    if (sessionType === 'qualiSessions') {
      this.showQualiSessions = isChecked;
    }
    if (sessionType === 'practiceSessions') {
      this.showPracticeSessions = isChecked;
    }
    if (!(this.showRaces || this.showQualiSessions || this.showPracticeSessions)) {
      this.filteredBySessionTypeCalendar = this.calendar;
      return true;
    } else {
      this.filteredBySessionTypeCalendar = this.calendar.filter((session: HomeEvent) => {
        if (
          ((session.sessionType === 'RACE' || session.sessionType === 'QUALIFYING_RACE' || session.sessionType === 'STAGE') &&
            this.showRaces) ||
          (session.sessionType === 'QUALIFYING' && this.showQualiSessions) ||
          (session.sessionType === 'PRACTICE' && this.showPracticeSessions)
        ) {
          return true;
        }
        return false;
      });
      return true;
    }
  }

  formatSessionTime(sessionTime: DateTime | number, pattern: string): string {
    const luxonTime = <DateTime>sessionTime;
    return luxonTime.toFormat(pattern);
  }

  private convertData(data: HomeEvent[], tz: string): HomeEvent[] {
    this.dates = new Map<string, DateTime>();
    for (let i = 0; i < data.length; i++) {
      if (data[i].sessionStartTime instanceof DateTime) {
        data[i].sessionStartTime = (data[i].sessionStartTime as DateTime).setZone(tz);
        data[i].sessionEndTime = (data[i].sessionEndTime as DateTime).setZone(tz);
      } else {
        data[i].sessionStartTime = DateTime.fromSeconds(data[i].sessionStartTime as number).setZone(tz);
        data[i].sessionEndTime = DateTime.fromSeconds(data[i].sessionEndTime as number).setZone(tz);
      }
      this.dates.set((data[i].sessionStartTime as DateTime).toFormat('DDD'), (data[i].sessionStartTime as DateTime));
    }
    return data;
  }
}
