import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSeriesEditionModule } from '../series-edition/series-edition.module';
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
    SeriesEditionResolvePagingParams,
} from './';

let ENTITY_STATES = [
    ...seriesRoute,
    ...seriesPopupRoute,
];

@NgModule({
    imports: [
        MotorsportsDatabaseSeriesEditionModule,
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
        SeriesEditionResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseSeriesModule {}
