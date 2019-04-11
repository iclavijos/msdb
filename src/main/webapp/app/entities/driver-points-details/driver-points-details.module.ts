import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MotorsportsDatabaseSharedModule } from 'app/shared';
import {
    DriverPointsDetailsComponent,
    DriverPointsDetailsDetailComponent,
    DriverPointsDetailsUpdateComponent,
    DriverPointsDetailsDeletePopupComponent,
    DriverPointsDetailsDeleteDialogComponent,
    driverPointsDetailsRoute,
    driverPointsDetailsPopupRoute
} from './';

const ENTITY_STATES = [...driverPointsDetailsRoute, ...driverPointsDetailsPopupRoute];

@NgModule({
    imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        DriverPointsDetailsComponent,
        DriverPointsDetailsDetailComponent,
        DriverPointsDetailsUpdateComponent,
        DriverPointsDetailsDeleteDialogComponent,
        DriverPointsDetailsDeletePopupComponent
    ],
    entryComponents: [
        DriverPointsDetailsComponent,
        DriverPointsDetailsUpdateComponent,
        DriverPointsDetailsDeleteDialogComponent,
        DriverPointsDetailsDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseDriverPointsDetailsModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
