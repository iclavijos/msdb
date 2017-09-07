import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
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
    private subscription: Subscription;
    private eventSubscriber: Subscription
    sessionTypes = SessionType;
    durationTypes = DurationType;
    filterCategory: string;
    editions: any[];
    
    keysSession: any[];
    keysDuration: any[];
    
    scoringSessions: EventSession[];
    
    driversPoints: any;

    constructor(
        private eventService: EventService,
        private eventEditionService: EventEditionService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
            this.loadDriversPoints(params['id']);
        });
        this.registerChangesInEventEdition();
        
        this.keysDuration = Object.keys(this.durationTypes).filter(Number);
        this.keysSession = Object.keys(this.sessionTypes).filter(Number);
    }

    load (id) {
        this.eventEditionService.find(id).subscribe((eventEdition) => {
            this.eventEdition = eventEdition;
            this.loadSessions(id);
            this.eventService.findEventEditionIds(eventEdition.event.id).subscribe(
                    (res: Response) => this.editions = res.json());
        });
    }
    
    loadSessions(id) {
        this.eventEditionService.findSessions(id, this.eventEdition.trackLayout.racetrack.timeZone).subscribe(eventSessions => {
            this.eventEdition.sessions = eventSessions.json;
            for(let session of this.eventEdition.sessions) {
                if (session.awardsPoints) {
                    this.scoringSessions.push(session);
                }
            }
        });
    }
    
    loadDriversPoints(id) {
        this.eventEditionService.loadDriversPoints(id).subscribe(driversPoints => {
            this.driversPoints = driversPoints.json;
        }); 
    }
    
    jumpToEdition(id) {
        if (!id) return false;
        this.router.navigate(['/event-edition', id]);
    }
    
    previousState() {
        //this.router.navigate(['/event/' + this.eventEdition.event.id]);
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }
    
    registerChangesInEventEdition() {
        this.eventSubscriber = this.eventManager.subscribe(
            'eventEditionListModification',
            (response) => this.load(this.eventEdition.id)
        );
        this.eventSubscriber.add(this.eventManager.subscribe(
            'eventSessionListModification', 
            (response) => this.loadSessions(this.eventEdition.id)));
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
