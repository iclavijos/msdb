import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ResponseWrapper } from '../../shared';

import { EventEdition, EventEditionService } from '../event-edition';
import { SeriesEditionService } from '../series-edition';

@Component({
    selector: 'jhi-standings',
    templateUrl: './standings.component.html'
})
export class StandingsComponent implements OnInit {

    private drivers: any;
    private teams: any;
    private manufacturers: any;
    @Input()
    eventEditionId: number;
    @Input()
    seriesEditionId: number;
    
    driverPointsDetail: any;
    
    constructor(
            private eventEditionService: EventEditionService,
            private seriesEditionService: SeriesEditionService,
            private http: Http,
            private router: Router) { }
    
    ngOnInit() {
    	if (this.eventEditionId) {
	        this.eventEditionService.loadDriversPoints(this.eventEditionId).subscribe(driversPoints => {
	            this.drivers = driversPoints.json;
	        });
	    } else if (this.seriesEditionId) {
	    	this.seriesEditionService.findDriversStandings(this.seriesEditionId).subscribe(driversStandings => {
	    		this.drivers = driversStandings.json();
	    	});
	    }
    }
    
    getPointsDetail(driverId: number) {
        if (this.eventEditionId != undefined) {
            this.router.navigate(['/driver-points-details', {
                eventEditionId: this.eventEditionId,
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