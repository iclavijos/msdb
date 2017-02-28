import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared';

import {
    SeriesEditionService,
    SeriesEditionPopupService,
    SeriesEditionComponent,
    SeriesEditionDetailComponent,
    SeriesEditionDialogComponent,
    SeriesEditionPopupComponent,
    SeriesEditionDeletePopupComponent,
    SeriesEditionDeleteDialogComponent,
    seriesEditionRoute,
    seriesEditionPopupRoute,
    SeriesEditionResolvePagingParams,
} from './';

let ENTITY_STATES = [
    ...seriesEditionRoute,
    ...seriesEditionPopupRoute,
];

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        SeriesEditionComponent,
        SeriesEditionDetailComponent,
        SeriesEditionDialogComponent,
        SeriesEditionDeleteDialogComponent,
        SeriesEditionPopupComponent,
        SeriesEditionDeletePopupComponent,
    ],
    entryComponents: [
        SeriesEditionComponent,
        SeriesEditionDialogComponent,
        SeriesEditionPopupComponent,
        SeriesEditionDeleteDialogComponent,
        SeriesEditionDeletePopupComponent,
    ],
    providers: [
        SeriesEditionService,
        SeriesEditionPopupService,
        SeriesEditionResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseSeriesEditionModule {}
