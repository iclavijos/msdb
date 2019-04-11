import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MotorsportsDatabaseSharedModule } from 'app/shared';
import {
    EventSessionComponent,
    EventSessionDetailComponent,
    EventSessionUpdateComponent,
    EventSessionDeletePopupComponent,
    EventSessionDeleteDialogComponent,
    eventSessionRoute,
    eventSessionPopupRoute
} from './';

const ENTITY_STATES = [...eventSessionRoute, ...eventSessionPopupRoute];

@NgModule({
    imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        EventSessionComponent,
        EventSessionDetailComponent,
        EventSessionUpdateComponent,
        EventSessionDeleteDialogComponent,
        EventSessionDeletePopupComponent
    ],
    entryComponents: [
        EventSessionComponent,
        EventSessionUpdateComponent,
        EventSessionDeleteDialogComponent,
        EventSessionDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEventSessionModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
