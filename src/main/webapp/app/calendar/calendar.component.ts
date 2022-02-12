import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { IEventEdition } from 'app/entities/event-edition/event-edition.model';
import { EventEditionService } from 'app/entities/event-edition/service/event-edition.service';
import { TimeZone } from 'app/home/home-events.component';

import { DateTime } from 'luxon';

import { FullCalendarComponent, CalendarOptions, EventClickArg } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import caLocale from '@fullcalendar/core/locales/ca';
import enLocale from '@fullcalendar/core/locales/en-gb';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class MyEvent {
  id!: number;
  title!: string;
  eventName!: string;
  sessionName!: string;
  duration!: number;
  startTime!: number;
  endTime!: number;
  totalDuration!: number;
  textColor!: string;
  backgroundColor!: string;
  color!: string;
  start!: string;
  end!: string;
  seriesLogoUrl!: string;
  seriesName!: string;
  allDay = false;
  status!: string;
  sessionType!: string;
  racetrack!: string;
  racetrackLayoutUrl!: string;
  categories!: string[];
  event!: any;
  rally!: boolean;
  raid!: boolean;
}

@Component({
  selector: 'jhi-event-dialog',
  templateUrl: './event-dialog.component.html'
})
export class EventDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MyEvent,
    protected router: Router
  ) {}

  public close(): void {
    this.dialogRef.close();
  }

  public navigateToEvent(eventEdition: IEventEdition): void {
    this.dialogRef.close();
    this.router.navigate(['/event', eventEdition.event!.id, 'edition', eventEdition.id]);
  }
}

@Component({
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  // calendarPlugins = [dayGridPlugin, listPlugin, luxon2Plugin];
  calendarLocales = [esLocale, caLocale, enLocale];

  sessionsSrc: MyEvent[] = [];
  filterModified = false;
  timezone!: string;
  timezones: TimeZone[] = [];

  calendarOptions: CalendarOptions = {};

  filter = new FormControl();
  series: string[] = [];

  private langChangeSubscription!: Subscription;

  constructor(
    private eventEditionService?: EventEditionService,
    private sessionStorageService?: SessionStorageService,
    private accountService?: AccountService,
    private translateService?: TranslateService,
    private http?: HttpClient,
    private eventDialog?: MatDialog
  ) {}

  events = (dates: any, callback: any): void => {
    let sessions: any[];
    if (this.filterModified) {
      if (this.filter.value.length > 0) {
        sessions = this.sessionsSrc.filter(item =>
          this.filter.value.includes(item.seriesName));
      } else {
        sessions = this.sessionsSrc;
      }
      this.filterModified = false;
      callback(this.convertEvents(sessions, this.timezone));
    } else {
      this.eventEditionService!.findCalendarEvents(dates.start, dates.end).subscribe({
        next: events => {
          this.filter = new FormControl();
          this.sessionsSrc = events;
          this.series = [...new Set(events.map(s => s.seriesName as string))].sort();
          callback(this.convertEvents(this.sessionsSrc, this.timezone));
        }
      });
    }
  };

  ngOnInit(): void {
    this.timezone = DateTime.local().zoneName;
    this.http!.get<TimeZone[]>('api/timezones').subscribe(res => (this.timezones = res));

    this.calendarOptions = {
      themeSystem: 'bootstrap5',
      initialView: 'dayGridMonth',
      titleFormat: 'DDD',
      eventClick: this.openEventDialog.bind(this),
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      nowIndicator: true,
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit'
      },
      aspectRatio: 1,
      allDaySlot: false,
      timeZone: this.timezone,
      locales: this.calendarLocales,
      events: this.events
    };
  }

  ngAfterViewInit(): void {
    let localeKey = this.sessionStorageService!.retrieve('locale');
    if (!localeKey) {
      this.accountService!.getAuthenticationState()
        .subscribe(
          account =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            localeKey = account!.langKey);
    }

    this.calendarComponent.getApi().setOption('locale', localeKey);

    this.langChangeSubscription = this.translateService!.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.calendarComponent.getApi().setOption('locale', langChangeEvent.lang);
    });
  }

  changeTimezone(): void {
    this.convertEvents(this.sessionsSrc, this.timezone);
  }

  filterSessions(): void {
    this.filterModified = true;
    this.calendarComponent.getApi().refetchEvents();
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
  }

  openEventDialog = (eventClick: EventClickArg): void => {
    this.eventDialog!.open(EventDialogComponent, {
      data: { event: eventClick }
    });
  }

  convertEvents(sessions: MyEvent[], currentTZ: string, includeCancelled = false): MyEvent[] {
    const result: MyEvent[] = [];
    for (const session of sessions) {
      const newEvent = new MyEvent();
      newEvent.id = session.id;
      newEvent.title = `${session.eventName} ${session.sessionName}`;
      newEvent.eventName = session.eventName;
      newEvent.sessionName = session.sessionName;
      newEvent.start = DateTime.fromSeconds(session.startTime, {
          zone: currentTZ
        }).toISO();
      newEvent.duration = session.duration;
      newEvent.totalDuration = session.totalDuration;
      newEvent.end = DateTime.fromSeconds(session.endTime, {
          zone: currentTZ
        }).toISO();
      newEvent.seriesLogoUrl = session.seriesLogoUrl;
      newEvent.textColor = 'white';
      newEvent.sessionType = session.sessionType;
      newEvent.status = session.status;
      newEvent.racetrack = session.racetrack;
      newEvent.racetrackLayoutUrl = session.racetrackLayoutUrl;
      newEvent.categories = session.categories;
      newEvent.allDay = session.raid;
      newEvent.rally = session.rally;
      newEvent.raid = session.raid;
      newEvent.backgroundColor = 'pink';
      if (session.status === 'C') {
        newEvent.backgroundColor = 'red';
      } else if (session.status === 'S') {
        newEvent.backgroundColor = 'orange';
      } else {
        if (session.sessionType === 'RACE') {
          newEvent.backgroundColor = 'green';
        } else if (session.sessionType === 'QUALIFYING' || session.sessionType === 'QUALIFYING_RACE') {
          newEvent.backgroundColor = 'blue';
        } else {
          newEvent.backgroundColor = 'grey';
        }
      }
      if (includeCancelled || session.status === 'O') {
        result.push(newEvent);
      }
    }
    return result;
  }
}
