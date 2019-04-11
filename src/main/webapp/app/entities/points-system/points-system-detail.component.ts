import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { PointsSystem } from './points-system.model';
import { PointsSystemService } from './points-system.service';

@Component({
    selector: 'jhi-points-system-detail',
    templateUrl: './points-system-detail.component.html'
})
export class PointsSystemDetailComponent implements OnInit, OnDestroy {

    pointsSystem: PointsSystem;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private pointsSystemService: PointsSystemService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPointsSystems();
    }

    load(id) {
        this.pointsSystemService.find(id).subscribe((pointsSystem) => {
            this.pointsSystem = pointsSystem;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPointsSystems() {
        this.eventSubscriber = this.eventManager.subscribe(
            'pointsSystemListModification',
            (response) => this.load(this.pointsSystem.id)
        );
    }
}
