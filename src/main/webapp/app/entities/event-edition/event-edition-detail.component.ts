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
    navigationIds = null;
    showPoints = false;
    driversBestTimes: any;

    keysSession: any[];
    keysDuration: any[];

    scoringSessions: EventSession[];

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
        });
        this.registerChangeInEventEditions();

        this.keysDuration = Object.keys(this.durationTypes).filter(Number);
        this.keysSession = Object.keys(this.sessionTypes).filter(Number);
    }

    load(id) {
        this.eventEditionService.find(id).subscribe((eventEdition) => {
            this.eventEdition = eventEdition;
            this.loadSessions(id);
            if (eventEdition.seriesId) {
            	this.eventEditionService.findPrevNextInSeries(id).subscribe(
                        (res: Response) => this.navigationIds = res);
            }
            this.eventService.findEventEditionIds(eventEdition.event.id).subscribe(
                    (res: Response) => this.editions = res.json());
            this.eventEditionService.findDriversBestTimes(id).subscribe(
            	(res: Response) => this.driversBestTimes = res.json);
        });
    }

    loadSessions(id) {
        this.eventEditionService.findSessions(id, this.eventEdition.trackLayout.racetrack.timeZone).subscribe((eventSessions) => {
            this.eventEdition.sessions = eventSessions.json;
            this.eventEdition.sessions.forEach((item, index) =>
               this.showPoints = this.showPoints || (item.pointsSystemsSession !== null && item.pointsSystemsSession.length > 0));
        });
    }

    jumpToEdition(id) {
        if (!id) {
            return false;
        }
        this.router.navigate(['/event-edition', id]);
    }

    previousState() {
        // this.router.navigate(['/event/' + this.eventEdition.event.id]);
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEventEditions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'eventEditionListModification',
            (response) => this.load(this.eventEdition.id)
        );
        this.eventSubscriber.add(this.eventManager.subscribe(
            'eventSessionListModification',
            (response) => this.loadSessions(this.eventEdition.id)));
    }

    convertToCurrentTZ() {
        const currentTZ = moment.tz.guess();
        for(const session of this.eventEdition.sessions) {
            session.sessionStartTime.tz(currentTZ);
        }
        this.convertedTime = true;
    }

    convertToLocalTZ() {
        for(const session of this.eventEdition.sessions) {
            session.sessionStartTime.tz(this.eventEdition.trackLayout.racetrack.timeZone);
        }
        this.convertedTime = false;
    }

}
