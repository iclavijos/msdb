import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared';

import {
    SeriesService,
    SeriesPopupService,
    SeriesComponent,
    SeriesDetailComponent,
    SeriesDialogComponent,
    SeriesPopupComponent,
    SeriesDeletePopupComponent,
    SeriesDeleteDialogComponent,
    seriesRoute,
    seriesPopupRoute,
    SeriesResolvePagingParams,
} from './';

let ENTITY_STATES = [
    ...seriesRoute,
    ...seriesPopupRoute,
];

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        SeriesComponent,
        SeriesDetailComponent,
        SeriesDialogComponent,
        SeriesDeleteDialogComponent,
        SeriesPopupComponent,
        SeriesDeletePopupComponent,
    ],
    entryComponents: [
        SeriesComponent,
        SeriesDialogComponent,
        SeriesPopupComponent,
        SeriesDeleteDialogComponent,
        SeriesDeletePopupComponent,
    ],
    providers: [
        SeriesService,
        SeriesPopupService,
        SeriesResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseSeriesModule {}
