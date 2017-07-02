import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared';

import {
    EventEntryResultService,
    EventEntryResultPopupService,
    EventEntryResultComponent,
    EventEntryResultDetailComponent,
    EventEntryResultDialogComponent,
    EventEntryResultPopupComponent,
    EventEntryResultDeletePopupComponent,
    EventEntryResultDeleteDialogComponent,
    EventEntryUploadResultsPopupComponent,
    EventEntryUploadResultsDialogComponent,
    EventEntryUploadLapByLapPopupComponent,
    EventEntryUploadLapByLapDialogComponent,
    eventEntryResultRoute,
    eventEntryResultPopupRoute,
} from './';

let ENTITY_STATES = [
    ...eventEntryResultRoute,
    ...eventEntryResultPopupRoute,
];

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    exports: [
        EventEntryResultComponent
    ],
    declarations: [
        EventEntryResultComponent,
        EventEntryResultDetailComponent,
        EventEntryResultDialogComponent,
        EventEntryResultDeleteDialogComponent,
        EventEntryResultPopupComponent,
        EventEntryResultDeletePopupComponent,
        EventEntryUploadResultsPopupComponent,
        EventEntryUploadResultsDialogComponent,
        EventEntryUploadLapByLapPopupComponent,
        EventEntryUploadLapByLapDialogComponent,
    ],
    entryComponents: [
        EventEntryResultComponent,
        EventEntryResultDialogComponent,
        EventEntryResultPopupComponent,
        EventEntryResultDeleteDialogComponent,
        EventEntryResultDeletePopupComponent,
        EventEntryUploadResultsPopupComponent,
        EventEntryUploadResultsDialogComponent,
        EventEntryUploadLapByLapPopupComponent,
        EventEntryUploadLapByLapDialogComponent,
    ],
    providers: [
        EventEntryResultService,
        EventEntryResultPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEventEntryResultModule {}
