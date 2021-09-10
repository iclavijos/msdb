import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import * as moment from 'moment-timezone';

@Component({
  selector: 'jhi-home-events',
  templateUrl: './home-events.component.html',
  styleUrls: ['home.scss']
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
    this.http.get<HttpResponse<any>>('api/home/calendar').subscribe(res => {
      this.calendar = this.convertData(res, this.timezone);
      this.filteredBySessionTypeCalendar = this.calendar;
    });
    this.http.get<HttpResponse<any>>('api/timezones').subscribe(res => {
      this.timezones = res;
    });
  }

  private convertData(data, tz) {
    this.dates = new Set();
    for (let i = 0; i < data.length; i++) {
      if (moment.isMoment(data[i].sessionStartTime)) {
        data[i].sessionStartTime.tz(tz);
        data[i].sessionEndTime.tz(tz);
      } else {
        data[i].sessionStartTime = moment(data[i].sessionStartTime * 1000).tz(tz);
        data[i].sessionEndTime = moment(data[i].sessionEndTime * 1000).tz(tz);
      }
      this.dates.add(data[i].sessionStartTime.tz(tz).format('LL'));
    }
    return data;
  }

  filteredSessions(day) {
    return this.filteredBySessionTypeCalendar.filter(item => item.sessionStartTime.format('LL') === day);
  }

  changeTimezone() {
    this.calendar = this.convertData(this.calendar, this.timezone);
    this.filteredBySessionTypeCalendar = this.calendar;
  }

  filterBySessionType(sessionType, isChecked) {
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
    } else {
      this.filteredBySessionTypeCalendar = this.calendar.filter(session => {
        if (
          ((session.sessionType === 'RACE' || session.sessionType === 'QUALIFYING_RACE') && this.showRaces) ||
          (session.sessionType === 'QUALIFYING' && this.showQualiSessions) ||
          (session.sessionType === 'PRACTICE' && this.showPracticeSessions)
        ) {
          return true;
        }
        return false;
      });
    }
  }
}
