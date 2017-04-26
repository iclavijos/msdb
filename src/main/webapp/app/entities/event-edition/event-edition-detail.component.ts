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
import { EventEntry } from '../event-entry/event-entry.model';
import { EventEntryService } from '../event-entry/event-entry.service';

import { DurationType, SessionType } from '../../shared';

@Component({
    selector: 'jhi-event-edition-detail',
    templateUrl: './event-edition-detail.component.html'
})
export class EventEditionDetailComponent implements OnInit, OnDestroy {

    eventEdition: EventEdition;
    eventSubscriber: Subscription;
    private subscription: any;
    sessionTypes = SessionType;
    durationTypes = DurationType;
    sessions: EventSession[];
    eventEntries: EventEntry[];
    filterCategory: string;
    editions: any[];
    
    keysSession: any[];
    keysDuration: any[];

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventService: EventService,
        private eventEditionService: EventEditionService,
        private eventEntryService: EventEntryService,
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
            this.loadEntries(id);
            this.eventService.findEventEditionIds(eventEdition.event.id).subscribe(
                    (res: Response) => this.editions = res.json());
        });
    }
    
    loadSessions(id) {
        this.eventEditionService.findSessions(id).subscribe(eventSessions => {
            this.eventEdition.sessions = eventSessions.json();
        });
    }
    
    loadEntries(id) {
        this.eventEntryService.findEntries(id).subscribe(
            (res: Response) => {
                this.eventEntries = res.json();
            }
        );
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
        this.eventSubscriber.add(this.eventManager.subscribe('eventEntryListModification', (response) => this.loadEntries(this.eventEdition.id)));
    }

}
