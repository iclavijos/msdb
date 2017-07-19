import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager , JhiDataUtils } from 'ng-jhipster';

import { Driver } from './driver.model';
import { DriverService } from './driver.service';

@Component({
    selector: 'jhi-driver-detail',
    templateUrl: './driver-detail.component.html'
})
export class DriverDetailComponent implements OnInit, OnDestroy {

    driver: Driver;
    stats: any[];
    yearsStats: number[];
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
            this.loadStats(params['id']);
            this.loadYears(params['id']);
        });
        this.registerChangeInDrivers();
    }

    load(id) {
        this.driverService.find(id).subscribe((driver) => {
            this.driver = driver;
            this.compositeName = this.driver.surname + ', ' + this.driver.name;
        });
    }
    loadStats(id) {
        this.driverService.getStats(id).subscribe((stats) => {
           this.stats = stats.json;
        });
    }
    loadStatsYear(id, year) {
        this.driverService.getStatsYear(id, year).subscribe((stats) => {
           this.stats = stats.json;
        });
    }
    loadYears(id) {
        this.driverService.getYears(id).subscribe((stats) => {
           this.yearsStats = stats.json;
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
    
    finishingPosition(position: number): string {
        if (position === 900) return 'DNF';
        if (position === 901) return 'DNS';
        if (position === 902) return 'DSQ';
        return '' + position;
    }
    
    jumpToYear(year) {
        if (!year) this.loadStats(this.driver.id);
        else this.loadStatsYear(this.driver.id, year);
    }
}
