import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseStandingsModule} from '../standings/standings.module';
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
    SeriesEditionCalendarPopupComponent,
    SeriesEditionCalendarDialogComponent,
    SeriesEditionDriversChampionsPopupComponent,
    SeriesEditionDriversChampionsDialogComponent,
    seriesEditionRoute,
    seriesEditionPopupRoute,
    SeriesEditionResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...seriesEditionRoute,
    ...seriesEditionPopupRoute,
];

@NgModule({
    imports: [
        MotorsportsDatabaseStandingsModule,
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    exports: [
        SeriesEditionComponent
    ],
    declarations: [
        SeriesEditionComponent,
        SeriesEditionDetailComponent,
        SeriesEditionDialogComponent,
        SeriesEditionDeleteDialogComponent,
        SeriesEditionPopupComponent,
        SeriesEditionDeletePopupComponent,
        SeriesEditionCalendarPopupComponent,
        SeriesEditionCalendarDialogComponent,
        SeriesEditionDriversChampionsPopupComponent,
        SeriesEditionDriversChampionsDialogComponent,
    ],
    entryComponents: [
        SeriesEditionComponent,
        SeriesEditionDialogComponent,
        SeriesEditionPopupComponent,
        SeriesEditionDeleteDialogComponent,
        SeriesEditionDeletePopupComponent,
        SeriesEditionCalendarPopupComponent,
        SeriesEditionCalendarDialogComponent,
        SeriesEditionDriversChampionsPopupComponent,
        SeriesEditionDriversChampionsDialogComponent,
    ],
    providers: [
        SeriesEditionService,
        SeriesEditionPopupService,
        SeriesEditionResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseSeriesEditionModule {}
