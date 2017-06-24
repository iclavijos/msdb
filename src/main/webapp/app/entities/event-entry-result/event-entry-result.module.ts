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
    ],
    entryComponents: [
        EventEntryResultComponent,
        EventEntryResultDialogComponent,
        EventEntryResultPopupComponent,
        EventEntryResultDeleteDialogComponent,
        EventEntryResultDeletePopupComponent,
        EventEntryUploadResultsPopupComponent,
        EventEntryUploadResultsDialogComponent,
    ],
    providers: [
        EventEntryResultService,
        EventEntryResultPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEventEntryResultModule {}
