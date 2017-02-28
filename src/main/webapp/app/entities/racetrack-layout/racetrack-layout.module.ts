import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared';

import {
    RacetrackLayoutService,
    RacetrackLayoutPopupService,
    RacetrackLayoutComponent,
    RacetrackLayoutDetailComponent,
    RacetrackLayoutDialogComponent,
    RacetrackLayoutPopupComponent,
    RacetrackLayoutDeletePopupComponent,
    RacetrackLayoutDeleteDialogComponent,
    racetrackLayoutRoute,
    racetrackLayoutPopupRoute,
} from './';

let ENTITY_STATES = [
    ...racetrackLayoutRoute,
    ...racetrackLayoutPopupRoute,
];

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        RacetrackLayoutComponent,
        RacetrackLayoutDetailComponent,
        RacetrackLayoutDialogComponent,
        RacetrackLayoutDeleteDialogComponent,
        RacetrackLayoutPopupComponent,
        RacetrackLayoutDeletePopupComponent,
    ],
    entryComponents: [
        RacetrackLayoutComponent,
        RacetrackLayoutDialogComponent,
        RacetrackLayoutPopupComponent,
        RacetrackLayoutDeleteDialogComponent,
        RacetrackLayoutDeletePopupComponent,
    ],
    providers: [
        RacetrackLayoutService,
        RacetrackLayoutPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseRacetrackLayoutModule {}
