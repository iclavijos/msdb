import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService, JhiDataUtils } from 'ng-jhipster';
import { FuelProvider } from './fuel-provider.model';
import { FuelProviderService } from './fuel-provider.service';

@Component({
    selector: 'jhi-fuel-provider-detail',
    templateUrl: './fuel-provider-detail.component.html'
})
export class FuelProviderDetailComponent implements OnInit, OnDestroy {

    fuelProvider: FuelProvider;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: JhiDataUtils,
        private fuelProviderService: FuelProviderService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.fuelProviderService.find(id).subscribe(fuelProvider => {
            this.fuelProvider = fuelProvider;
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
