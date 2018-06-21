import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { DriverPointsDetails } from './driver-points-details.model';
import { DriverPointsDetailsService } from './driver-points-details.service';

@Component({
    selector: 'jhi-driver-points-details-detail',
    templateUrl: './driver-points-details-detail.component.html'
})
export class DriverPointsDetailsDetailComponent implements OnInit, OnDestroy {

    driverPointsDetails: DriverPointsDetails;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private driverPointsDetailsService: DriverPointsDetailsService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDriverPointsDetails();
    }

    load(id) {
        this.driverPointsDetailsService.find(id).subscribe((driverPointsDetails) => {
            this.driverPointsDetails = driverPointsDetails;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDriverPointsDetails() {
        this.eventSubscriber = this.eventManager.subscribe(
            'driverPointsDetailsListModification',
            (response) => this.load(this.driverPointsDetails.id)
        );
    }
}
