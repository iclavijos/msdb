import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService, DataUtils } from 'ng-jhipster';

import { Racetrack } from './racetrack.model';
import { RacetrackService } from './racetrack.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-racetrack',
    templateUrl: './racetrack.component.html'
})
export class RacetrackComponent implements OnInit, OnDestroy {
    racetracks: Racetrack[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private racetrackService: RacetrackService,
        private alertService: AlertService,
        private dataUtils: DataUtils,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['racetrack']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.racetrackService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.racetracks = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.racetrackService.query().subscribe(
            (res: Response) => {
                this.racetracks = res.json();
                this.currentSearch = '';
            },
            (res: Response) => this.onError(res.json())
        );
    }

    search (query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInRacetracks();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: Racetrack) {
        return item.id;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    registerChangeInRacetracks() {
        this.eventSubscriber = this.eventManager.subscribe('racetrackModification', (response) => this.updateRacetracksList(response));
    }
    
    updateRacetracksList(response) {
        let racetrack: Racetrack = <Racetrack>response.content;
        let remove: Boolean = false;
        if (racetrack.name == null) {
            remove = true;
        }
        let found: Boolean = false;
        let i: number = 0;
        while (!found && i < this.racetracks.length) {
            if (!remove) {
                if (this.racetracks[i].id == racetrack.id) {
                    found = true;
                    this.racetracks[i] = racetrack;
                }
            } else {
                if (this.racetracks[i].id == response.content) {
                    found = true;
                    this.racetracks.splice(i, 1);
                }
            }
            i++;
        }
        if (!found) {
            if (racetrack.name != null) {
                this.racetracks.push(racetrack);
            }
        }
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
