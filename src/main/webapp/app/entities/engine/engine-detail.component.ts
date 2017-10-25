import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager , JhiDataUtils } from 'ng-jhipster';

import { Engine } from './engine.model';
import { EngineService } from './engine.service';

@Component({
    selector: 'jhi-engine-detail',
    templateUrl: './engine-detail.component.html'
})
export class EngineDetailComponent implements OnInit, OnDestroy {

    engine: Engine;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private engineService: EngineService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEngines();
    }

    load(id) {
        this.engineService.find(id).subscribe((engine) => {
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
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEngines() {
        this.eventSubscriber = this.eventManager.subscribe(
            'engineListModification',
            (response) => this.load(this.engine.id)
        );
    }
}
