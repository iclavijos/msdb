import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { TyreProvider } from './tyre-provider.model';
import { TyreProviderService } from './tyre-provider.service';

@Component({
    selector: 'jhi-tyre-provider-detail',
    templateUrl: './tyre-provider-detail.component.html'
})
export class TyreProviderDetailComponent implements OnInit, OnDestroy {

    tyreProvider: TyreProvider;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private tyreProviderService: TyreProviderService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTyreProviders();
    }

    load(id) {
        this.tyreProviderService.find(id).subscribe((tyreProvider) => {
            this.tyreProvider = tyreProvider;
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

    registerChangeInTyreProviders() {
        this.eventSubscriber = this.eventManager.subscribe(
            'tyreProviderListModification',
            (response) => this.load(this.tyreProvider.id)
        );
    }
}
