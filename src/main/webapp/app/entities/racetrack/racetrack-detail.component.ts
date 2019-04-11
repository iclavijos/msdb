import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IRacetrack } from 'app/shared/model/racetrack.model';

@Component({
    selector: 'jhi-racetrack-detail',
    templateUrl: './racetrack-detail.component.html'
})
export class RacetrackDetailComponent implements OnInit {
    racetrack: IRacetrack;

    constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ racetrack }) => {
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
}
