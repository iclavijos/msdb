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
    SeriesEditionCalendarPopupComponent,
    SeriesEditionCalendarDialogComponent,
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
    ],
    entryComponents: [
        SeriesEditionComponent,
        SeriesEditionDialogComponent,
        SeriesEditionPopupComponent,
        SeriesEditionDeleteDialogComponent,
        SeriesEditionDeletePopupComponent,
        SeriesEditionCalendarPopupComponent,
        SeriesEditionCalendarDialogComponent,
    ],
    providers: [
        SeriesEditionService,
        SeriesEditionPopupService,
        SeriesEditionResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseSeriesEditionModule {}
