import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { Racetrack } from './racetrack.model';
import { RacetrackService } from './racetrack.service';

@Component({
    selector: 'jhi-racetrack-detail',
    templateUrl: './racetrack-detail.component.html'
})
export class RacetrackDetailComponent implements OnInit, OnDestroy {

    racetrack: Racetrack;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private racetrackService: RacetrackService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInRacetracks();
    }

    load(id) {
        this.racetrackService.find(id).subscribe((racetrack) => {
            this.racetrack = racetrack;
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

    registerChangeInRacetracks() {
        this.eventSubscriber = this.eventManager.subscribe(
            'racetrackListModification',
            (response) => this.load(this.racetrack.id)
        );
    }
}
