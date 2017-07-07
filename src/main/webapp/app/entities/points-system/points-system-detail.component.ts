import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { PointsSystem } from './points-system.model';
import { PointsSystemService } from './points-system.service';

@Component({
    selector: 'jhi-points-system-detail',
    templateUrl: './points-system-detail.component.html'
})
export class PointsSystemDetailComponent implements OnInit, OnDestroy {

    pointsSystem: PointsSystem;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private pointsSystemService: PointsSystemService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.pointsSystemService.find(id).subscribe(pointsSystem => {
            this.pointsSystem = pointsSystem;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
