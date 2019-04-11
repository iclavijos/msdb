import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MotorsportsDatabaseSharedModule } from 'app/shared';
import {
    ChassisComponent,
    ChassisDetailComponent,
    ChassisUpdateComponent,
    ChassisDeletePopupComponent,
    ChassisDeleteDialogComponent,
    chassisRoute,
    chassisPopupRoute
} from './';

const ENTITY_STATES = [...chassisRoute, ...chassisPopupRoute];

@NgModule({
    imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ChassisComponent,
        ChassisDetailComponent,
        ChassisUpdateComponent,
        ChassisDeleteDialogComponent,
        ChassisDeletePopupComponent
    ],
    entryComponents: [ChassisComponent, ChassisUpdateComponent, ChassisDeleteDialogComponent, ChassisDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseChassisModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
