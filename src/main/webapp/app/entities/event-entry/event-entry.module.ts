import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MotorsportsDatabaseSharedModule } from 'app/shared';
import {
    EventEntryComponent,
    EventEntryDetailComponent,
    EventEntryUpdateComponent,
    EventEntryDeletePopupComponent,
    EventEntryDeleteDialogComponent,
    eventEntryRoute,
    eventEntryPopupRoute
} from './';

const ENTITY_STATES = [...eventEntryRoute, ...eventEntryPopupRoute];

@NgModule({
    imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        EventEntryComponent,
        EventEntryDetailComponent,
        EventEntryUpdateComponent,
        EventEntryDeleteDialogComponent,
        EventEntryDeletePopupComponent
    ],
    entryComponents: [EventEntryComponent, EventEntryUpdateComponent, EventEntryDeleteDialogComponent, EventEntryDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEventEntryModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
