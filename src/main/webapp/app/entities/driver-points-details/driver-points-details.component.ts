import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { DriverPointsDetails } from './driver-points-details.model';
import { DriverPointsDetailsService } from './driver-points-details.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-driver-points-details',
    templateUrl: './driver-points-details.component.html'
})
export class DriverPointsDetailsComponent implements OnInit, OnDestroy {
    driverPointsDetails: DriverPointsDetails[];
    currentAccount: any;
    eventSubscriber: Subscription;
    eventEditionId: number;
    seriesEditionIds: number[];
    driverId: number;
    driverName: string;

    constructor(
        private driverPointsDetailsService: DriverPointsDetailsService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.eventEditionId = activatedRoute.snapshot.params['eventEditionId'];
        this.driverId = activatedRoute.snapshot.params['driverId'];
        this.seriesEditionIds = activatedRoute.snapshot.params['seriesEditionIds'];
    }

    loadAll() {
        this.driverPointsDetailsService.findDriverPointsDetail(this.eventEditionId, this.driverId).subscribe(
                res => {
                    this.driverPointsDetails = res.json;
                    this.driverName = res.json[0].driverName;
                });
    }

    translatable(reason: string) {
        return reason.startsWith('motorsportsDatabaseApp');
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInDriverPointsDetails();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: DriverPointsDetails) {
        return item.id;
    }
    registerChangeInDriverPointsDetails() {
        this.eventSubscriber = this.eventManager.subscribe('driverPointsDetailsListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    previousState() {
        window.history.back();
    }
}
