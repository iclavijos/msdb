import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { ResponseWrapper } from '../../shared';

import { Racetrack } from './racetrack.model';
import { RacetrackService } from './racetrack.service';
import { RacetrackLayout } from '../racetrack-layout/racetrack-layout.model';
import { RacetrackLayoutService } from '../racetrack-layout/racetrack-layout.service';

@Component({
    selector: 'jhi-racetrack-detail',
    templateUrl: './racetrack-detail.component.html'
})
export class RacetrackDetailComponent implements OnInit, OnDestroy {

    racetrack: Racetrack;
    racetrackLayouts: RacetrackLayout[];
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    private racetrackId: number;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private racetrackService: RacetrackService,
        private racetrackLayoutService: RacetrackLayoutService,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
            this.racetrackId = params['id'];
        });
        this.registerChangeInRacetracks();
    }

    load(id) {
        this.racetrackService.find(id).subscribe((racetrack) => {
            this.racetrack = racetrack;
        });
        this.loadLayouts(id);
    }

    loadLayouts(id) {
        this.racetrackService.findLayouts(id).subscribe(
                (res: ResponseWrapper) => {
                    this.racetrackLayouts = res.json;
                }
        );
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        // this.router.navigateByUrl('racetrack');
        this.eventManager.destroy(this.eventSubscriber);
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
        this.eventSubscriber.add(this.eventManager.subscribe(
            'racetrackLayoutListModification',
            (response) => this.loadLayouts(this.racetrack.id)));
    }
}
