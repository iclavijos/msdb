import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { EventSession } from '../event-session';
import { EventEntryResult } from './event-entry-result.model';
import { EventEntryResultService } from './event-entry-result.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

import { SessionType } from '../../shared/enumerations/sessionType.enum';

@Component({
    selector: 'jhi-event-entry-result',
    templateUrl: './event-entry-result.component.html'
})
export class EventEntryResultComponent implements OnInit, OnDestroy {

    @Input() session: EventSession;
    sessionTypes = SessionType;
    eventEntryResults: EventEntryResult[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventEntryResultService: EventEntryResultService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        //this.jhiLanguageService.setLocations(['eventEntryResult']);
    }

    loadAll() {
        this.eventEntryResultService.query(this.session).subscribe(
            (res: Response) => {
                this.eventEntryResults = res.json();
            },
            (res: Response) => this.onError(res.json())
        );
    }

    clear() {
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInEventEntryResults();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: EventEntryResult) {
        return item.id;
    }
    
    gap(currentLapTime: number) {
        return currentLapTime - this.eventEntryResults[0].bestLapTime;
    }

    processResults() {
        this.eventEntryResultService.processSessionResults(this.session.id).subscribe();
    }

    registerChangeInEventEntryResults() {
        this.eventSubscriber = this.eventManager.subscribe('eventEntryResultListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
