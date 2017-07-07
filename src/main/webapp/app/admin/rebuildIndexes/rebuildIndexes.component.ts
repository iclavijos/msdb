import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { JhiLanguageService } from 'ng-jhipster';

@Component({
    selector: 'jhi-rebuild-indexes',
    templateUrl: './rebuildIndexes.component.html'
})
export class JhiRebuildIndexesComponent implements OnInit {
    constructor (
        private jhiLanguageService: JhiLanguageService,
        private http: Http
    ) {
    }
    
    ngOnInit() {
        this.http.get('/management/indexes/rebuild').map((res: Response) => res.json()).subscribe();
    }
}
