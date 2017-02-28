import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService, DataUtils } from 'ng-jhipster';
import { Engine } from './engine.model';
import { EngineService } from './engine.service';

@Component({
    selector: 'jhi-engine-detail',
    templateUrl: './engine-detail.component.html'
})
export class EngineDetailComponent implements OnInit, OnDestroy {

    engine: Engine;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: DataUtils,
        private engineService: EngineService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['engine']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.engineService.find(id).subscribe(engine => {
            this.engine = engine;
        });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
