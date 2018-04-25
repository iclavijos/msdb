import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ResponseWrapper } from '../../shared';

import { EventEditionService } from '../event-edition';
import { EventSession } from '../event-session';

@Component({
    selector: 'jhi-laps-analysis',
    templateUrl: './laps-analysis.component.html',
    styleUrls: [
        'lapsAnalysis.css'
    ]
})
export class LapsAnalysisComponent implements OnInit {

    @Input() eventEditionId: number;
    races: EventSession[];
    
    constructor(
            private http: Http,
            private router: Router,
            private eventEditionService: EventEditionService) { }
    
    ngOnInit() {
    	this.eventEditionService.findRaces(this.eventEditionId).subscribe(races => {
            this.races = races.json;
        });
    }
    
}