import { Component, OnInit } from '@angular/core';

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
    dialogVisible: boolean;
    currentLocale: string;
    
    header: any;
    options: any;
    
    constructor(private _translateService: TranslateService,
                private eventEditionService: EventEditionService) { }

    ngOnInit() {
        this.header = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
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
    
    private loadEvents(e) {
        let start = e.view.start;
        let end = e.view.end;
        this.eventEditionService.findCalendarEvents(new Date(start), new Date(end)).subscribe(events => {this.convertEvents(events);});
    }
    
    private eventClick(e) {
        this.event = new MyEvent();
        this.event.title = e.calEvent.eventName;
        this.event.sessionName = e.calEvent.sessionName;
        
        let start = e.calEvent.start;
        let end = e.calEvent.end;

        this.event.id = e.calEvent.id;
        this.event.start = start.locale(this.currentLocale).format("LLLL");
        this.event.end = end.locale(this.currentLocale).format("LLLL");
        this.event.allDay = e.calEvent.allDay;
        this.dialogVisible = true;
    }
    
    private convertEvents(sessions) {
        let currentTZ = moment.tz.guess();
        this.events = new Array();
        for(let session of sessions) {
            let newEvent = new MyEvent();
            newEvent.id = session.id;
            newEvent.title = session.eventName + ' - ' + session.sessionName;
            newEvent.eventName = session.eventName;
            newEvent.sessionName = session.sessionName;
            newEvent.start = moment(session.startTime * 1000).tz(currentTZ);
            newEvent.end = moment(session.endTime * 1000).tz(currentTZ);

            this.events.push(newEvent);
        }
    }
}

export class MyEvent {
    id: number;
    title: string;
    eventName: string;
    sessionName: string;
    start: any;
    end: any;
    allDay: boolean = false;
}