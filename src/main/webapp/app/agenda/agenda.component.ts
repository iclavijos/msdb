import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { EventEditionService } from 'app/entities/event-edition/service/event-edition.service';
import { CalendarComponent, MyEvent } from '../calendar/calendar.component';
import { TimeZone } from 'app/home/home-events.component';

import { DateTime } from 'luxon';

export class EventItem {
  name!: string;
  racetrack!: string;
  layoutUrl!: string;
  categories!: string[];
}

@Component({
  selector: 'jhi-agenda-component',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.scss']
})
export class AgendaComponent implements OnInit {
  selectedDate!: DateTime;
  endDate!: DateTime;
  rangeType!: string;
  events!: MyEvent[];
  calendarComponent!: CalendarComponent;
  uniqueSeries!: string[];
  currentEvent!: any;
  backgroundColorIndex!: number;
  timezone!: string;
  timezones!: TimeZone[];

  constructor(private eventEditionService: EventEditionService, private translateService: TranslateService, private http: HttpClient) {
    this.rangeType = 'WEEK';
    this.selectedDate = DateTime.local().startOf('week');
    this.endDate = DateTime.local().endOf('week');
    this.events = [];
    this.calendarComponent = new CalendarComponent();
  }

  ngOnInit() {
    this.timezone = DateTime.now().zoneName;
    this.http.get<TimeZone[]>('api/timezones').subscribe((res: TimeZone[]) => (this.timezones = res));
    this.query();
  }

  dateRangeChanged() {
    if (this.rangeType === 'WEEK') {
      this.selectedDate = this.selectedDate.startOf('week');
      this.endDate = this.selectedDate.endOf('week');
    } else {
      this.selectedDate = this.selectedDate.startOf('month');
      this.endDate = this.selectedDate.endOf('month');
    }
    this.query();
  }

  nextPeriod() {
    if (this.rangeType === 'WEEK') {
      this.selectedDate = this.selectedDate.plus({ days: 7});
    } else {
      this.selectedDate = this.selectedDate.plus({ months: 1 });
    }
    this.dateRangeChanged();
  }

  previousPeriod() {
    if (this.rangeType === 'WEEK') {
      this.selectedDate = this.selectedDate.minus({ days: 7});
    } else {
      this.selectedDate = this.selectedDate.minus({ months: 1 });
    }
    this.dateRangeChanged();
  }

  query() {
    this.eventEditionService
      .findCalendarEvents(
        this.selectedDate.toJSDate(),
        this.endDate
          .plus({ days: 1})
          .toJSDate()
      )
      .subscribe(events => {
        this.backgroundColorIndex = -1;
        this.events = this.calendarComponent.convertEvents(events, this.timezone, true); // .filter(e => e.status === 'O'), this.timezone, false);
        this.uniqueSeries = this.events.map(e => (e.seriesLogoUrl ? e.seriesLogoUrl[0] : '')).filter(this.onlyUniqueSeries);
      });
  }

  uniqueEventsInSeries(series: string): EventItem[] {
    return this.events
      .filter(item => (item.seriesLogoUrl ? item.seriesLogoUrl[0] : '') === series)
      .map((item: MyEvent) => ({
          name: item.eventName,
          racetrack: item.racetrack,
          layoutUrl: item.racetrackLayoutUrl,
          categories: item.categories
        })
      )
      .filter(this.onlyUniqueEvents);
  }

  sessionsEvent(event: any): MyEvent[] {
    return this.events.filter((item: MyEvent) => item.eventName === event.name);
  }

  formatDateStr(stringDate: string, pattern: string, raid = false): string {
    return this.formatDate(DateTime.fromISO(stringDate), pattern, raid);
  }

  formatDate(date: DateTime, pattern: string, raid = false): string {
    if (raid) {
      return date.setLocale(this.translateService.currentLang).toFormat('dddd, LL');
    }
    return date.setLocale(this.translateService.currentLang).toFormat(pattern);
  }

  backgroundColor(): string {
    this.backgroundColorIndex++;
    if (this.backgroundColorIndex % 3 === 0) {
      return '#dbffff';
    } else if (this.backgroundColorIndex % 3 === 1) {
      return '#fff8d6';
    } else {
      return '#d6ffcc';
    }
  }

  eventStatus(event: any): string {
    return this.events.filter((item: MyEvent) => item.eventName === event.name)[0].status;
  }

  private onlyUniqueSeries(value: string, index: number, self: string[]): boolean {
    return self.indexOf(value) === index;
  }

  private onlyUniqueEvents(value: EventItem, index: number, self: EventItem[]): boolean {
    return self.map((x: EventItem) => x.name).indexOf(value.name) === index;
  }
}
