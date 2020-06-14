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
  timezone: any;
  timezones: any;
  dates = new Set();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.timezone = moment.tz.guess();
    if (this.timezone === undefined) {
      this.timezone = 'Europe/London';
    }
    this.http.get<HttpResponse<any>>('api/home/calendar').subscribe(res => {
      this.calendar = this.convertData(res, this.timezone);
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
    return this.calendar.filter(item => item.sessionStartTime.format('LL') === day);
  }

  changeTimezone() {
    this.calendar = this.convertData(this.calendar, this.timezone);
  }
}
