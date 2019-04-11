import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MotorsportsDatabaseSharedModule } from 'app/shared';
import {
    EventEntryResultComponent,
    EventEntryResultDetailComponent,
    EventEntryResultUpdateComponent,
    EventEntryResultDeletePopupComponent,
    EventEntryResultDeleteDialogComponent,
    eventEntryResultRoute,
    eventEntryResultPopupRoute
} from './';

const ENTITY_STATES = [...eventEntryResultRoute, ...eventEntryResultPopupRoute];

@NgModule({
    imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        EventEntryResultComponent,
        EventEntryResultDetailComponent,
        EventEntryResultUpdateComponent,
        EventEntryResultDeleteDialogComponent,
        EventEntryResultDeletePopupComponent
    ],
    entryComponents: [
        EventEntryResultComponent,
        EventEntryResultUpdateComponent,
        EventEntryResultDeleteDialogComponent,
        EventEntryResultDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEventEntryResultModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
