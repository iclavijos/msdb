import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { IEventEdition } from 'app/shared/model/event-edition.model';
import { EventEditionService } from 'app/entities/event-edition/event-edition.service';

import * as moment from 'moment-timezone';

import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timeLinePlugin from '@fullcalendar/timeline';
import listPlugin from '@fullcalendar/list';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';

import esLocale from '@fullcalendar/core/locales/es';
import caLocale from '@fullcalendar/core/locales/ca';
import enLocale from '@fullcalendar/core/locales/en-gb';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class MyEvent {
  id: number;
  title: string;
  eventName: string;
  sessionName: string;
  textColor: string;
  color: string;
  start: any;
  end: any;
  seriesLogoUrl: string;
  allDay = false;
  status: string;

  event: any;
}

@Component({
  selector: 'jhi-event-dialog',
  templateUrl: 'event-dialog.component.html'
})
export class EventDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MyEvent,
    protected router: Router
  ) {}

  public close() {
    this.dialogRef.close();
  }

  public navigateToEvent(event: IEventEdition) {
    this.dialogRef.close();
    this.router.navigate(['/event/edition', event.id, 'view-ed']);
  }
}

@Component({
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent;

  calendarPlugins = [dayGridPlugin, timeGridPlugin, timeLinePlugin, listPlugin, momentTimezonePlugin];
  calendarLocales = [esLocale, caLocale, enLocale];

  sessions: any;
  timezone: string;
  timezones: any[];

  private langChangeSubscription: Subscription;

  constructor(
    private eventEditionService: EventEditionService,
    private translateService: TranslateService,
    private http: HttpClient,
    private eventDialog: MatDialog
  ) {}

  events = (dates, callback) => {
    this.eventEditionService.findCalendarEvents(dates.start, dates.end).subscribe(events => {
      callback(this.convertEvents(events, this.timezone));
    });
  };

  ngOnInit() {
    this.timezone = moment.tz.guess();
    if (this.timezone === undefined) {
      this.timezone = 'Europe/London';
    }
    this.http.get<any[]>('api/timezones').subscribe(res => (this.timezones = res));
  }

  ngAfterViewInit() {
    if (this.translateService.currentLang) {
      this.calendarComponent.getApi().setOption('locale', this.translateService.currentLang);
    } else {
      this.calendarComponent.getApi().setOption('locale', 'es');
    }
    this.langChangeSubscription = this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.calendarComponent.getApi().setOption('locale', langChangeEvent.lang);
    });
  }

  ngOnDestroy() {
    this.langChangeSubscription.unsubscribe();
  }

  openEventDialog = eventInfo => {
    this.eventDialog.open(EventDialogComponent, {
      data: { event: eventInfo }
    });
  };

  private convertEvents(sessions, currentTZ) {
    this.sessions = sessions;
    const result = [];
    for (const session of sessions) {
      const newEvent = new MyEvent();
      newEvent.id = session.id;
      newEvent.title = session.eventName + ' - ' + session.sessionName;
      newEvent.eventName = session.eventName;
      newEvent.sessionName = session.sessionName;
      newEvent.start = moment(session.startTime * 1000)
        .tz(currentTZ)
        .toDate();
      newEvent.end = moment(session.endTime * 1000)
        .tz(currentTZ)
        .toDate();
      newEvent.seriesLogoUrl = session.seriesLogoUrl;
      newEvent.textColor = 'white';
      if (session.status === 'C') {
        newEvent.color = 'red';
      } else if (session.status === 'S') {
        newEvent.color = 'orange';
      } else {
        if (session.sessionType === 2) {
          newEvent.color = 'green';
        } else if (session.sessionType === 1 || session.sessionType === 3) {
          newEvent.color = 'blue';
        } else {
          newEvent.color = 'grey';
        }
      }
      result.push(newEvent);
    }
    return result;
  }

  changeTimezone() {
    this.convertEvents(this.sessions, this.timezone);
  }
}
