import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MotorsportsDatabaseSharedModule } from 'app/shared';
import {
    FuelProviderComponent,
    FuelProviderDetailComponent,
    FuelProviderUpdateComponent,
    FuelProviderDeletePopupComponent,
    FuelProviderDeleteDialogComponent,
    fuelProviderRoute,
    fuelProviderPopupRoute
} from './';

const ENTITY_STATES = [...fuelProviderRoute, ...fuelProviderPopupRoute];

@NgModule({
    imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        FuelProviderComponent,
        FuelProviderDetailComponent,
        FuelProviderUpdateComponent,
        FuelProviderDeleteDialogComponent,
        FuelProviderDeletePopupComponent
    ],
    entryComponents: [
        FuelProviderComponent,
        FuelProviderUpdateComponent,
        FuelProviderDeleteDialogComponent,
        FuelProviderDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseFuelProviderModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
