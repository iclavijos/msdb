import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventManager, JhiLanguageService } from 'ng-jhipster';
import { Response } from '@angular/http';
import { Subscription } from 'rxjs/Rx';
import { Engine } from '../engine';
import { EventService } from '../event/event.service';
import { EventEdition } from './event-edition.model';
import { EventEditionService } from './event-edition.service';
import { EventSession } from '../event-session/event-session.model';

import { DurationType, SessionType } from '../../shared';

import * as moment from 'moment-timezone';

@Component({
    selector: 'jhi-event-edition-detail',
    templateUrl: './event-edition-detail.component.html'
})
export class EventEditionDetailComponent implements OnInit, OnDestroy {

    convertedTime = false;
    eventEdition: EventEdition;
    eventSubscriber: Subscription;
    private subscription: any;
    sessionTypes = SessionType;
    durationTypes = DurationType;
    filterCategory: string;
    editions: any[];
    
    keysSession: any[];
    keysDuration: any[];

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventService: EventService,
        private eventEditionService: EventEditionService,
        private eventManager: EventManager,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.jhiLanguageService.setLocations(['event']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
        this.registerChangesInEvent();
        
        this.keysDuration = Object.keys(this.durationTypes).filter(Number);
        this.keysSession = Object.keys(this.sessionTypes).filter(Number);
    }

    load (id) {
        this.eventEditionService.find(id).subscribe(eventEdition => {
            this.eventEdition = eventEdition;
            this.loadSessions(id);
            this.eventService.findEventEditionIds(eventEdition.event.id).subscribe(
                    (res: Response) => this.editions = res.json());
        });
    }
    
    loadSessions(id) {
        this.eventEditionService.findSessions(id, this.eventEdition.trackLayout.racetrack.timeZone).subscribe(eventSessions => {
            this.eventEdition.sessions = eventSessions.json();
        });
    }
    
    jumpToEdition(id) {
        if (!id) return false;
        this.router.navigate(['/event-edition', id]);
    }
    
    previousState() {
        this.router.navigate(['/event/' + this.eventEdition.event.id]);
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
        this.subscription.unsubscribe();
    }
    
    registerChangesInEvent() {
        this.eventSubscriber = this.eventManager.subscribe('eventSessionListModification', (response) => this.loadSessions(this.eventEdition.id));
    }
    
    convertToCurrentTZ() {
        let currentTZ = moment.tz.guess();
        for(let session of this.eventEdition.sessions) {
            session.sessionStartTime.tz(currentTZ);
        }
        this.convertedTime = true;
    }
    
    convertToLocalTZ() {
        for(let session of this.eventEdition.sessions) {
            session.sessionStartTime.tz(this.eventEdition.trackLayout.racetrack.timeZone);
        }
        this.convertedTime = false;
    }

}
