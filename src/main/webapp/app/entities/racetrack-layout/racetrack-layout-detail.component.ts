import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager , JhiDataUtils } from 'ng-jhipster';

import { RacetrackLayout } from './racetrack-layout.model';
import { RacetrackLayoutService } from './racetrack-layout.service';

@Component({
    selector: 'jhi-racetrack-layout-detail',
    templateUrl: './racetrack-layout-detail.component.html'
})
export class RacetrackLayoutDetailComponent implements OnInit, OnDestroy {

    racetrackLayout: RacetrackLayout;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private racetrackLayoutService: RacetrackLayoutService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['idLayout']);
        });
        this.registerChangeInRacetrackLayouts();
    }

    load(id) {
        this.racetrackLayoutService.find(id).subscribe((racetrackLayout) => {
            this.racetrackLayout = racetrackLayout;
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

    registerChangeInRacetrackLayouts() {
        this.eventSubscriber = this.eventManager.subscribe(
            'racetrackLayoutListModification',
            (response) => this.load(this.racetrackLayout.id)
        );
    }
}
