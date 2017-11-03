import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { Driver } from './driver.model';
import { DriverService } from './driver.service';

@Component({
    selector: 'jhi-driver-detail',
    templateUrl: './driver-detail.component.html'
})
export class DriverDetailComponent implements OnInit, OnDestroy {

    driver: Driver;
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    compositeName: String;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private driverService: DriverService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDrivers();
    }

    load(id) {
        this.driverService.find(id).subscribe((driver) => {
            this.driver = driver;
            this.compositeName = this.driver.surname + ', ' + this.driver.name;
        });
    }
    
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDrivers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'driverListModification',
            (response) => this.load(this.driver.id)
        );
    }
}
