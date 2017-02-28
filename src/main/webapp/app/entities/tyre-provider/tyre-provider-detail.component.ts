import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService, DataUtils } from 'ng-jhipster';
import { TyreProvider } from './tyre-provider.model';
import { TyreProviderService } from './tyre-provider.service';

@Component({
    selector: 'jhi-tyre-provider-detail',
    templateUrl: './tyre-provider-detail.component.html'
})
export class TyreProviderDetailComponent implements OnInit, OnDestroy {

    tyreProvider: TyreProvider;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: DataUtils,
        private tyreProviderService: TyreProviderService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['tyreProvider']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.tyreProviderService.find(id).subscribe(tyreProvider => {
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
    }

}
