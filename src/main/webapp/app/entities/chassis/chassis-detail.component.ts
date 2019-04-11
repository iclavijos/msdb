import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChassis } from 'app/shared/model/chassis.model';

@Component({
    selector: 'jhi-chassis-detail',
    templateUrl: './chassis-detail.component.html'
})
export class ChassisDetailComponent implements OnInit {
    chassis: IChassis;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ chassis }) => {
            this.chassis = chassis;
        });
    }

    previousState() {
        window.history.back();
    }
}
