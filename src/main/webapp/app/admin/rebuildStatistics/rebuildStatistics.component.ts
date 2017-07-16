import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';

@Component({
    selector: 'jhi-rebuild-statistics',
    templateUrl: './rebuildStatistics.component.html'
})
export class JhiRebuildStatisticsComponent implements OnInit {
    constructor (
        private http: Http
    ) {
    }
    
    ngOnInit() {
        this.http.get('/management/stats/rebuild').map((res: Response) => res.json()).subscribe();
    }
}
