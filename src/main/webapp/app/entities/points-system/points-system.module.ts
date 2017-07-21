import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared';
import {
    PointsSystemService,
    PointsSystemPopupService,
    PointsSystemComponent,
    PointsSystemDetailComponent,
    PointsSystemDialogComponent,
    PointsSystemPopupComponent,
    PointsSystemDeletePopupComponent,
    PointsSystemDeleteDialogComponent,
    pointsSystemRoute,
    pointsSystemPopupRoute,
    PointsSystemResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...pointsSystemRoute,
    ...pointsSystemPopupRoute,
];

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        PointsSystemComponent,
        PointsSystemDetailComponent,
        PointsSystemDialogComponent,
        PointsSystemDeleteDialogComponent,
        PointsSystemPopupComponent,
        PointsSystemDeletePopupComponent,
    ],
    entryComponents: [
        PointsSystemComponent,
        PointsSystemDialogComponent,
        PointsSystemPopupComponent,
        PointsSystemDeleteDialogComponent,
        PointsSystemDeletePopupComponent,
    ],
    providers: [
        PointsSystemService,
        PointsSystemPopupService,
        PointsSystemResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabasePointsSystemModule {}
