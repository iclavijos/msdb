import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { Chassis } from './chassis.model';
import { ChassisService } from './chassis.service';

@Component({
    selector: 'jhi-chassis-detail',
    templateUrl: './chassis-detail.component.html'
})
export class ChassisDetailComponent implements OnInit, OnDestroy {

    chassis: Chassis;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private chassisService: ChassisService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInChassis();
    }

    load(id) {
        this.chassisService.find(id).subscribe((chassis) => {
            this.chassis = chassis;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInChassis() {
        this.eventSubscriber = this.eventManager.subscribe(
            'chassisListModification',
            (response) => this.load(this.chassis.id)
        );
    }
}
