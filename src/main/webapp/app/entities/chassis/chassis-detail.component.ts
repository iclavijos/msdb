import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { Chassis } from './chassis.model';
import { ChassisService } from './chassis.service';

@Component({
    selector: 'jhi-chassis-detail',
    templateUrl: './chassis-detail.component.html'
})
export class ChassisDetailComponent implements OnInit, OnDestroy {

    chassis: Chassis;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private chassisService: ChassisService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['chassis']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.chassisService.find(id).subscribe(chassis => {
            this.chassis = chassis;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
