import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared';

import {
    RacetrackService,
    RacetrackPopupService,
    RacetrackComponent,
    RacetrackDetailComponent,
    RacetrackDialogComponent,
    RacetrackPopupComponent,
    RacetrackDeletePopupComponent,
    RacetrackDeleteDialogComponent,
    racetrackRoute,
    racetrackPopupRoute,
    racetrackLayoutRoute,
    racetrackLayoutPopupRoute
} from './';

let ENTITY_STATES = [
    ...racetrackRoute,
    ...racetrackPopupRoute,
    ...racetrackLayoutRoute,
    ...racetrackLayoutPopupRoute
];

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        RacetrackComponent,
        RacetrackDetailComponent,
        RacetrackDialogComponent,
        RacetrackDeleteDialogComponent,
        RacetrackPopupComponent,
        RacetrackDeletePopupComponent,
    ],
    entryComponents: [
        RacetrackComponent,
        RacetrackDialogComponent,
        RacetrackPopupComponent,
        RacetrackDeleteDialogComponent,
        RacetrackDeletePopupComponent,
    ],
    providers: [
        RacetrackService,
        RacetrackPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseRacetrackModule {}
