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
    declarations: [
        EventEntryResultComponent,
        EventEntryResultDetailComponent,
        EventEntryResultDialogComponent,
        EventEntryResultDeleteDialogComponent,
        EventEntryResultPopupComponent,
        EventEntryResultDeletePopupComponent,
    ],
    entryComponents: [
        EventEntryResultComponent,
        EventEntryResultDialogComponent,
        EventEntryResultPopupComponent,
        EventEntryResultDeleteDialogComponent,
        EventEntryResultDeletePopupComponent,
    ],
    providers: [
        EventEntryResultService,
        EventEntryResultPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEventEntryResultModule {}
