import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';

import { JhiAlertService } from 'ng-jhipster';

@Component({
    selector: 'jhi-rebuild-statistics',
    templateUrl: './rebuildStatistics.component.html'
})
export class JhiRebuildStatisticsComponent implements OnInit {
    
    private finished: boolean;
    
    constructor (
        private http: Http,
        private alertService: JhiAlertService
    ) {
    }
    
    ngOnInit() {
        this.finished = false;
        this.http.get('/management/stats/rebuild').map(
                (res: Response) => this.finishedOk()).subscribe();
    }
    
    private finishedOk() {
        this.alertService.success('motorsportsDatabaseApp.stats.home.rebuilt', null, null);
        this.finished = true;
    }
}
