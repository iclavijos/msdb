import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ResponseWrapper } from '../../shared';

import { EventEdition } from '../event-edition';

@Component({
    selector: 'jhi-standings',
    templateUrl: './standings.component.html'
})
export class StandingsComponent {

    @Input()
    drivers: any;
    @Input()
    teams: any;
    @Input()
    manufacturers: any;
    @Input()
    eventEdition: EventEdition;
    @Input()
    seriesEditionId: number;
    
    driverPointsDetail: any;
    
    constructor(
            private http: Http,
            private router: Router) { }
    
    getPointsDetail(driverId: number) {
        if (this.eventEdition != undefined) {
            this.router.navigate(['/driver-points-details', {
                eventEditionId: this.eventEdition.id,
                driverId: driverId,
                seriesEditionId: this.seriesEditionId
            }]);
        } else {
            //Navigate to popup with points in series edition
            this.router.navigate(['/driver-points-series', {
                driverId: driverId,
                seriesEditionId: this.seriesEditionId
            }]);
        }
    }
}