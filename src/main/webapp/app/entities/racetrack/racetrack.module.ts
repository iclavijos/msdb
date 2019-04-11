import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MotorsportsDatabaseSharedModule } from 'app/shared';
import {
    RacetrackComponent,
    RacetrackDetailComponent,
    RacetrackUpdateComponent,
    RacetrackDeletePopupComponent,
    RacetrackDeleteDialogComponent,
    racetrackRoute,
    racetrackPopupRoute
} from './';

const ENTITY_STATES = [...racetrackRoute, ...racetrackPopupRoute];

@NgModule({
    imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        RacetrackComponent,
        RacetrackDetailComponent,
        RacetrackUpdateComponent,
        RacetrackDeleteDialogComponent,
        RacetrackDeletePopupComponent
    ],
    entryComponents: [RacetrackComponent, RacetrackUpdateComponent, RacetrackDeleteDialogComponent, RacetrackDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseRacetrackModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
