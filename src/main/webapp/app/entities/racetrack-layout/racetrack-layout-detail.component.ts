import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs/Rx';
import { RacetrackLayout } from './racetrack-layout.model';
import { RacetrackLayoutService } from './racetrack-layout.service';

@Component({
    selector: 'jhi-racetrack-layout-detail',
    templateUrl: './racetrack-layout-detail.component.html'
})
export class RacetrackLayoutDetailComponent implements OnInit, OnDestroy {

    racetrackLayout: RacetrackLayout;
    private subscription: any;
    eventSubscriber: Subscription;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: JhiDataUtils,
        private racetrackLayoutService: RacetrackLayoutService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['idLayout']);
        });
        
        this.eventSubscriber = this.eventManager.subscribe('racetrackLayoutModification', (response) => this.load(this.racetrackLayout.id));
    }

    load (id) {
        this.racetrackLayoutService.find(id).subscribe(racetrackLayout => {
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
        this.eventManager.destroy(this.eventSubscriber);
        this.subscription.unsubscribe();
    }

}
