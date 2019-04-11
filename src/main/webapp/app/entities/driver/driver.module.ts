import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MotorsportsDatabaseSharedModule } from 'app/shared';
import {
    DriverComponent,
    DriverDetailComponent,
    DriverUpdateComponent,
    DriverDeletePopupComponent,
    DriverDeleteDialogComponent,
    driverRoute,
    driverPopupRoute
} from './';

const ENTITY_STATES = [...driverRoute, ...driverPopupRoute];

@NgModule({
    imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [DriverComponent, DriverDetailComponent, DriverUpdateComponent, DriverDeleteDialogComponent, DriverDeletePopupComponent],
    entryComponents: [DriverComponent, DriverUpdateComponent, DriverDeleteDialogComponent, DriverDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseDriverModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
