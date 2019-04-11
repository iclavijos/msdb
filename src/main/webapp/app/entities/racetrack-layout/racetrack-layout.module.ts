import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MotorsportsDatabaseSharedModule } from 'app/shared';
import {
    RacetrackLayoutComponent,
    RacetrackLayoutDetailComponent,
    RacetrackLayoutUpdateComponent,
    RacetrackLayoutDeletePopupComponent,
    RacetrackLayoutDeleteDialogComponent,
    racetrackLayoutRoute,
    racetrackLayoutPopupRoute
} from './';

const ENTITY_STATES = [...racetrackLayoutRoute, ...racetrackLayoutPopupRoute];

@NgModule({
    imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        RacetrackLayoutComponent,
        RacetrackLayoutDetailComponent,
        RacetrackLayoutUpdateComponent,
        RacetrackLayoutDeleteDialogComponent,
        RacetrackLayoutDeletePopupComponent
    ],
    entryComponents: [
        RacetrackLayoutComponent,
        RacetrackLayoutUpdateComponent,
        RacetrackLayoutDeleteDialogComponent,
        RacetrackLayoutDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseRacetrackLayoutModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
