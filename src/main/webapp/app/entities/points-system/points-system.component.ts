import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { PointsSystem } from './points-system.model';
import { PointsSystemService } from './points-system.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-points-system',
    templateUrl: './points-system.component.html'
})
export class PointsSystemComponent implements OnInit, OnDestroy {
pointsSystems: PointsSystem[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private pointsSystemService: PointsSystemService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['pointsSystem']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.pointsSystemService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.pointsSystems = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.pointsSystemService.query().subscribe(
            (res: Response) => {
                this.pointsSystems = res.json();
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
        this.registerChangeInPointsSystems();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: PointsSystem) {
        return item.id;
    }



    registerChangeInPointsSystems() {
        this.eventSubscriber = this.eventManager.subscribe('pointsSystemListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
