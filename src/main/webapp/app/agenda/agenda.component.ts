import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { EventEditionService } from 'app/entities/event-edition/event-edition.service';
import { CalendarComponent, MyEvent } from 'app/calendar/calendar.component';

import { Moment } from 'moment';
import * as moment from 'moment-timezone';

@Component({
  selector: 'jhi-agenda-component',
  templateUrl: 'agenda.component.html',
  styleUrls: ['agenda.scss']
})
export class AgendaComponent implements OnInit {
  selectedDate: Moment;
  endDate: Moment;
  rangeType: string;
  events: MyEvent[];
  calendarComponent: CalendarComponent;
  uniqueSeries: string[];
  currentEvent: any;
  backgroundColorIndex: number;
  timezone: string;
  timezones: any[];

  constructor(private eventEditionService: EventEditionService, private translateService: TranslateService, private http: HttpClient) {
    this.rangeType = 'WEEK';
    this.selectedDate = moment().isoWeekday(1);
    this.endDate = moment().endOf('week');
    this.events = [];
    this.calendarComponent = new CalendarComponent(null, null, null, null);
  }

  ngOnInit() {
    this.timezone = moment.tz.guess();
    if (this.timezone === undefined) {
      this.timezone = 'Europe/London';
    }
    this.http.get<any[]>('api/timezones').subscribe(res => (this.timezones = res));
    this.query();
  }

  dateRangeChanged() {
    if (this.rangeType === 'WEEK') {
      this.selectedDate = this.selectedDate.isoWeekday(1);
      this.endDate = this.selectedDate.clone().isoWeekday(7);
    } else {
      this.selectedDate = this.selectedDate.startOf('month');
      this.endDate = this.selectedDate.clone().endOf('month');
    }
    this.query();
  }

  nextPeriod() {
    if (this.rangeType === 'WEEK') {
      this.selectedDate = this.selectedDate.add(7, 'days');
    } else {
      this.selectedDate = this.selectedDate.add(1, 'M');
    }
    this.dateRangeChanged();
  }

  previousPeriod() {
    if (this.rangeType === 'WEEK') {
      this.selectedDate = this.selectedDate.subtract(7, 'days');
    } else {
      this.selectedDate = this.selectedDate.subtract(1, 'M');
    }
    this.dateRangeChanged();
  }

  query() {
    this.eventEditionService
      .findCalendarEvents(
        this.selectedDate.toDate(),
        this.endDate
          .clone()
          .add(1, 'd')
          .toDate()
      )
      .subscribe(events => {
        this.backgroundColorIndex = -1;
        this.events = this.calendarComponent.convertEvents(events, this.timezone, false, true); // .filter(e => e.status === 'O'), this.timezone, false);
        this.uniqueSeries = this.events.map(e => (e.seriesLogoUrl ? e.seriesLogoUrl[0] : '')).filter(this.onlyUniqueSeries);
      });
  }

  private onlyUniqueSeries(value, index, self) {
    return self.indexOf(value) === index;
  }

  private onlyUniqueEvents(value, index, self) {
    return self.map(x => x.name).indexOf(value.name) === index;
  }

  uniqueEventsInSeries(series: string) {
    return this.events
      .filter(item => (item.seriesLogoUrl ? item.seriesLogoUrl[0] : '') === series)
      .map(item => {
        return {
          name: item.eventName,
          racetrack: item.racetrack,
          layoutUrl: item.racetrackLayoutUrl,
          categories: item.categories
        };
      })
      .filter(this.onlyUniqueEvents);
  }

  sessionsEvent(event: any) {
    return this.events.filter(item => item.eventName === event.name);
  }

  formatDate(date: Moment, pattern: string, raid = false) {
    if (raid) {
      return date.locale(this.translateService.currentLang).format('dddd, LL');
    }
    return date.locale(this.translateService.currentLang).format(pattern);
  }

  backgroundColor() {
    this.backgroundColorIndex++;
    if (this.backgroundColorIndex % 3 === 0) {
      return '#dbffff';
    } else if (this.backgroundColorIndex % 3 === 1) {
      return '#fff8d6';
    } else {
      return '#d6ffcc';
    }
  }

  eventStatus(event: any) {
    return this.events.filter(item => item.eventName === event.name)[0].status;
  }
}
