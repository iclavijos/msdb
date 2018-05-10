import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';

import { TranslateService } from '@ngx-translate/core';

import { EventEditionService } from '../entities/event-edition';

import * as moment from 'moment-timezone';

@Component({
    templateUrl: './calendar.component.html',
    styles: [`
        .ui-grid-row div {
          padding: 4px 10px
        }
        
        .ui-grid-row div label {
          font-weight: bold;
        }
  `]
})

export class Calendar implements OnInit {

    events: any[];
    event: MyEvent;
    sessions: any;
    dialogVisible: boolean;
    currentLocale: string;
    timezone: string;
    timezones: any;

    header: any;
    options: any;

    constructor(private _translateService: TranslateService,
                private eventEditionService: EventEditionService,
                private http: Http) { }

    ngOnInit() {
        this.timezone = moment.tz.guess();
        if (this.timezone === undefined) {
            this.timezone = 'Europe/London';
        }
        this.http.get('api/timezones').subscribe((res: Response) => {
            this.timezones = res.json();
        });
        this.header = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'
        };
        this.options = {
            eventColor: '#CECECE',
            timeFormat: 'HH:mm'
        };
        if (this._translateService.currentLang) {
            this.currentLocale = this._translateService.currentLang;
        } else {
            this.currentLocale = 'es';
        }
    }

    loadEvents(e) {
        const start = new Date(e.view.start);
        const end = new Date(e.view.end);
        start.setDate(start.getDate() - 1);

        this.eventEditionService.findCalendarEvents(start,end).subscribe(events => {this.convertEvents(events, this.timezone);});
    }

    changeTimezone() {
        this.convertEvents(this.sessions, this.timezone);
    }

    eventClick(e) {
        this.event = new MyEvent();
        this.event.title = e.calEvent.eventName;
        this.event.sessionName = e.calEvent.sessionName;

        let start = e.calEvent.start;
        let end = e.calEvent.end;

        this.event.id = e.calEvent.id;
        this.event.start = start.locale(this.currentLocale).format("LLLL");
        this.event.end = end.locale(this.currentLocale).format("LLLL");
        this.event.allDay = e.calEvent.allDay;
        this.event.seriesLogoUrl = e.calEvent.seriesLogoUrl;
        this.dialogVisible = true;
    }

    private convertEvents(sessions, currentTZ) {
        this.sessions = sessions;
        this.events = new Array();
        for(let session of sessions) {
            let newEvent = new MyEvent();
            newEvent.id = session.id;
            newEvent.title = session.eventName + ' - ' + session.sessionName;
            newEvent.eventName = session.eventName;
            newEvent.sessionName = session.sessionName;
            newEvent.start = moment(session.startTime * 1000).tz(currentTZ);
            newEvent.end = moment(session.endTime * 1000).tz(currentTZ);
            newEvent.seriesLogoUrl = session.seriesLogoUrl;
            if (session.sessionType === 2) {
            	newEvent.textColor = 'white';
            	newEvent.color = 'green';
            }
            if (session.sessionType === 1 || session.sessionType === 3) {
            	newEvent.textColor = 'white';
            	newEvent.color = 'blue';
            }
            this.events.push(newEvent);
        }
    }
}

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
    allDay: boolean = false;
}
