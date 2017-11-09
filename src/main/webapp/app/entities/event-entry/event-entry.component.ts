import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiLanguageService, JhiAlertService } from 'ng-jhipster';

import { EventEdition } from '../event-edition';
import { EventEntry } from './event-entry.model';
import { EventEntryService } from './event-entry.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-event-entry',
    templateUrl: './event-entry.component.html',
    styleUrls: ['event-entry.css']
})
export class EventEntryComponent implements OnInit, OnDestroy {
    
    @Input() eventEdition: EventEdition;
    eventEntries: EventEntry[];
    currentAccount: any;
    filterCategory: any;
    eventSubscriber: Subscription;
    private selectedRaceEntry: number;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventEntryService: EventEntryService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
    }
    
    expandEntryData(raceNumber: number) {
        if (this.selectedRaceEntry === raceNumber) {
            this.selectedRaceEntry = null;
        } else {
            this.selectedRaceEntry = raceNumber;
        }
    }
    
    private getBigFaceUrl(portraitUrl: string) {
        if (portraitUrl != null) {
            let url = portraitUrl.replace("upload/", "upload/w_240,h_240,c_thumb,g_face,r_max/");
            let pos = url.lastIndexOf(".");
            if (pos > -1) {
                url = url.substring(0, pos);
            }
            url += ".png";
            
            return url;
        }
        return null;
    }
    
    private getSmallFaceUrl(portraitUrl: string) {
        if (portraitUrl != null) {
            let url = portraitUrl.replace("upload/", "upload/w_120,h_120,c_thumb,g_face,r_max/");
            let pos = url.lastIndexOf(".");
            if (pos > -1) {
                url = url.substring(0, pos);
            }
            url += ".png";
            
            return url;
        }
        return null;
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

    trackId(index: number, item: EventEntry) {
        return item.id;
    }
    registerChangeInEventEntries() {
        this.eventSubscriber = this.eventManager.subscribe('eventEntryListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
