import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { EventEdition } from '../event-edition';
import { EventEntry } from './event-entry.model';
import { EventEntryService } from './event-entry.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-event-entry',
    templateUrl: './event-entry.component.html'
})
export class EventEntryComponent implements OnInit, OnDestroy {
    
    @Input() eventEdition: EventEdition;
    eventEntries: EventEntry[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventEntryService: EventEntryService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        
    }

    loadAll() {
        this.eventEntryService.findEntries(this.eventEdition.id).subscribe(
            (res: Response) => {
                this.eventEntries = res.json();
            }
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInEventEntries();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: EventEntry) {
        return item.id;
    }

    registerChangeInEventEntries() {
        this.eventSubscriber = this.eventManager.subscribe('eventEntryListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
