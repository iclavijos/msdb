import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { JhiEventManager, JhiLanguageService, JhiDataUtils } from 'ng-jhipster';
import { Subscription } from 'rxjs/Rx';
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
    eventSubscriber: Subscription;
    private subscription: any;
    private racetrackId: number;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: JhiDataUtils,
        private racetrackService: RacetrackService,
        private racetrackLayoutService: RacetrackLayoutService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
            this.racetrackId = params['id'];
        });
        this.registerChangeInRacetrackLayouts();
    }

    load (id) {
        this.racetrackService.find(id).subscribe(racetrack => {
            this.racetrack = racetrack;
        });
        this.loadLayouts(id);
    }

    loadLayouts(id) {
        this.racetrackService.findLayouts(id).subscribe(
                (res: Response) => {
                    this.racetrackLayouts = res.json();
                }
        );
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    registerChangeInRacetrackLayouts() {
        this.eventSubscriber = this.eventManager.subscribe('racetrackModification', (response) => this.load(this.racetrackId));
        this.eventSubscriber.add(
                this.eventManager.subscribe('racetrackLayoutModification', (response) => this.loadLayouts(this.racetrackId)));
    }

    previousState() {
        this.router.navigateByUrl('racetrack');
        this.eventManager.destroy(this.eventSubscriber);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
