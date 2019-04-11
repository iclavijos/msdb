import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MotorsportsDatabaseSharedModule } from 'app/shared';
import {
    EventEditionComponent,
    EventEditionDetailComponent,
    EventEditionUpdateComponent,
    EventEditionDeletePopupComponent,
    EventEditionDeleteDialogComponent,
    eventEditionRoute,
    eventEditionPopupRoute
} from './';

const ENTITY_STATES = [...eventEditionRoute, ...eventEditionPopupRoute];

@NgModule({
    imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        EventEditionComponent,
        EventEditionDetailComponent,
        EventEditionUpdateComponent,
        EventEditionDeleteDialogComponent,
        EventEditionDeletePopupComponent
    ],
    entryComponents: [
        EventEditionComponent,
        EventEditionUpdateComponent,
        EventEditionDeleteDialogComponent,
        EventEditionDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEventEditionModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
