import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService, DataUtils } from 'ng-jhipster';
import { RacetrackLayout } from './racetrack-layout.model';
import { RacetrackLayoutService } from './racetrack-layout.service';

@Component({
    selector: 'jhi-racetrack-layout-detail',
    templateUrl: './racetrack-layout-detail.component.html'
})
export class RacetrackLayoutDetailComponent implements OnInit, OnDestroy {

    racetrackLayout: RacetrackLayout;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: DataUtils,
        private racetrackLayoutService: RacetrackLayoutService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['racetrack']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
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
        this.subscription.unsubscribe();
    }

}
