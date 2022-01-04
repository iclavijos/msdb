import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Moment } from 'moment';
import * as moment from 'moment-timezone';

export class HomeEvent {
  sessionName!: string;
  sessionStartTime!: number|Moment;
  sessionEndTime!: number|Moment;
  duration!: number;
  totalDuration!: number;
  durationType!: number;
  sessionType!: string;
  eventEditionId!: number;
  eventName!: string;
  racetrack!: string;
  seriesIds!: number[];
  seriesNames!: string[];
  seriesLogo!: string;
  rally!: boolean;
  raid!: boolean;
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
  calendar: any;
  filteredBySessionTypeCalendar: any;
  timezone: any;
  timezones: any;
  noEvents = false;
  dates = new Set();
  showRaces = false;
  showQualiSessions = false;
  showPracticeSessions = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.timezone = moment.tz.guess();
    if (this.timezone === undefined) {
      this.timezone = 'Europe/London';
    }
    this.http.get<HomeEvent[]>('api/home/calendar').subscribe((res: HomeEvent[]) => {
      this.calendar = this.convertData(res, this.timezone);
      this.filteredBySessionTypeCalendar = this.calendar;
    });
    this.http.get<TimeZone[]>('api/timezones').subscribe((res: TimeZone[]) => {
      this.timezones = res;
    });
  }

  filteredSessions(day: unknown): HomeEvent[] {
    const filterDay = <string>day;
    return this.filteredBySessionTypeCalendar.filter(
      (item: HomeEvent) => this.formatSessionTime(item.sessionStartTime, 'LL') === filterDay) as HomeEvent[];
  }

  changeTimezone() {
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

  formatSessionTime(sessionTime: Moment | number, pattern: string): string {
    const momentTime = <Moment>sessionTime;
    return momentTime.format(pattern);
  }

  private convertData(data: HomeEvent[], tz: string): HomeEvent[] {
    this.dates = new Set();
    for (let i = 0; i < data.length; i++) {
      let tmpStart: Moment;
      if (moment.isMoment(data[i].sessionStartTime)) {
        (data[i].sessionStartTime as Moment).tz(tz);
        (data[i].sessionEndTime as Moment).tz(tz);
        tmpStart = data[i].sessionStartTime as Moment;
      } else {
        data[i].sessionStartTime = moment.unix(data[i].sessionStartTime as number).tz(tz);
        data[i].sessionEndTime = moment.unix(data[i].sessionEndTime as number).tz(tz);
        tmpStart = moment(data[i].sessionStartTime as number).tz(tz);
      }
      this.dates.add(tmpStart.format('LL'));
    }
    return data;
  }
}
