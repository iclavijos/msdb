import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MotorsportsDatabaseSharedModule } from 'app/shared';
import {
    TyreProviderComponent,
    TyreProviderDetailComponent,
    TyreProviderUpdateComponent,
    TyreProviderDeletePopupComponent,
    TyreProviderDeleteDialogComponent,
    tyreProviderRoute,
    tyreProviderPopupRoute
} from './';

const ENTITY_STATES = [...tyreProviderRoute, ...tyreProviderPopupRoute];

@NgModule({
    imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        TyreProviderComponent,
        TyreProviderDetailComponent,
        TyreProviderUpdateComponent,
        TyreProviderDeleteDialogComponent,
        TyreProviderDeletePopupComponent
    ],
    entryComponents: [
        TyreProviderComponent,
        TyreProviderUpdateComponent,
        TyreProviderDeleteDialogComponent,
        TyreProviderDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseTyreProviderModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
