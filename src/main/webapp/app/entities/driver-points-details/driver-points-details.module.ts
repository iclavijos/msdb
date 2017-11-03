import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared';
import {
    DriverPointsDetailsService,
    DriverPointsDetailsPopupService,
    DriverPointsDetailsComponent,
    DriverPointsDetailsDetailComponent,
    DriverPointsDetailsDialogComponent,
    DriverPointsDetailsPopupComponent,
    DriverPointsDetailsDeletePopupComponent,
    DriverPointsDetailsDeleteDialogComponent,
    driverPointsDetailsRoute,
    driverPointsDetailsPopupRoute,
    DriverPointsSeriesPopupComponent,
    DriverPointsSeriesDialogComponent
} from './';

const ENTITY_STATES = [
    ...driverPointsDetailsRoute,
    ...driverPointsDetailsPopupRoute,
];

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        DriverPointsDetailsComponent,
        DriverPointsDetailsDetailComponent,
        DriverPointsDetailsDialogComponent,
        DriverPointsDetailsDeleteDialogComponent,
        DriverPointsDetailsPopupComponent,
        DriverPointsDetailsDeletePopupComponent,
        DriverPointsSeriesPopupComponent,
        DriverPointsSeriesDialogComponent
    ],
    entryComponents: [
        DriverPointsDetailsComponent,
        DriverPointsDetailsDialogComponent,
        DriverPointsDetailsPopupComponent,
        DriverPointsDetailsDeleteDialogComponent,
        DriverPointsDetailsDeletePopupComponent,
        DriverPointsSeriesPopupComponent
    ],
    providers: [
        DriverPointsDetailsService,
        DriverPointsDetailsPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseDriverPointsDetailsModule {}
