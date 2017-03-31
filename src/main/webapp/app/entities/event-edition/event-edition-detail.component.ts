import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventManager, JhiLanguageService } from 'ng-jhipster';
import { Subscription } from 'rxjs/Rx';
import { EventEdition } from './event-edition.model';
import { EventEditionService } from './event-edition.service';
import { EventSession } from '../event-session/event-session.model';

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
    
    keysSession: any[];
    keysDuration: any[];

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventEditionService: EventEditionService,
        private eventManager: EventManager,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.jhiLanguageService.setLocations(['eventEdition']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
        this.registerChangeInEventSessions();
        
        this.keysDuration = Object.keys(this.durationTypes).filter(Number);
        this.keysSession = Object.keys(this.sessionTypes).filter(Number);
    }

    load (id) {
        this.eventEditionService.find(id).subscribe(eventEdition => {
            this.eventEdition = eventEdition;
            this.loadSessions(id);
        });
    }
    
    loadSessions(id) {
        this.eventEditionService.findSessions(id).subscribe(eventSessions => {
            this.eventEdition.sessions = eventSessions.json();
        });
    }
    
    previousState() {
        //window.history.back();
        this.router.navigate(['/event-edition']);
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
        this.subscription.unsubscribe();
    }
    
    registerChangeInEventSessions() {
        this.eventSubscriber = this.eventManager.subscribe('eventSessionListModification', (response) => this.loadSessions(this.eventEdition.id));
    }

}
